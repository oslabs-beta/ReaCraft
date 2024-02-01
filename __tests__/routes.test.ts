import request, { Response } from 'supertest';
import db from '../server/models/dbModel';
import s3 from '../server/models/s3Model';
import { encrypt } from '../server/helpers/encryptDecrypt';
import path from 'path';
import fs from 'fs';
import {
  DesignQueryRes,
  DesignRow,
  userQueryRes,
  userRow,
} from '../docs/types';

const server = 'http://localhost:3000';
const testUserData = {
  username: 'test_user',
  email: 'test_user@123.com',
  password: '1234',
};

let sessionId: string;
let testUser: userRow;
let imagesToDelete: string[] = [];

const testImageBuffer = Buffer.from(
  fs.readFileSync(path.join(__dirname, './test.png'))
).toString('base64');

// set up test user in db
beforeAll(async () => {
  const { username, email, password } = testUserData;
  const userQueryRes: userQueryRes = await db.query(
    'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;',
    [username, email]
  );
  testUser = userQueryRes.rows[0];
  sessionId = encrypt(String(testUser._id));

  await db.query(
    "INSERT INTO passwords (user_id, hashed_psw) VALUES ($1, crypt($2, gen_salt('md5')));",
    [testUser._id, password]
  );
});

// clean up test user in db
afterAll(async () => {
  console.log(imagesToDelete);
  await db.query('DELETE FROM users WHERE _id = $1;', [testUser._id]);
  await db.end();
  const res = await s3
    .deleteObjects({
      Bucket: 'reactraft',
      Delete: {
        Objects: imagesToDelete.map((url: string): { Key: string } => {
          const imageUrl = new URL(url);
          return { Key: imageUrl.pathname.substring(1) };
        }),
        Quiet: false,
      },
    })
    .promise();
  console.log(res);
});

describe('GET /user', () => {
  // successfully get user
  it('responds with 200 status and application/json content type', async () => {
    const res: Response = await request(server)
      .get('/user')
      .set('Cookie', `sessionID=${sessionId}`);
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/application\/json/);
    expect(JSON.stringify(testUser)).toEqual(JSON.stringify(res.body));
  });

  // when there is no cookie
  it(
    'responds with 500 status and application/json content type ' +
      ' and Cookie error message',
    async () => {
      const res: Response = await request(server).get('/user');
      expect(res.status).toBe(500);
      expect(res.type).toMatch(/application\/json/);
      expect(res.body).toContain('Cookie err');
    }
  );

  // when userId is not in db
  it(
    'responds with 400 status and application/json content type ' +
      'and a getUser error message',
    async () => {
      const res: Response = await request(server)
        .get('/user')
        .set('Cookie', `sessionID=${encrypt('0')}`);
      expect(res.status).toBe(500);
      expect(res.type).toMatch(/application\/json/);
      expect(res.body).toContain('UserId not found');
    }
  );
});

describe('POST /login', () => {
  // successful login
  it('responds with 302 status and redirects to /home', async () => {
    const res: Response = await request(server)
      .post('/login')
      .send({ username: 'test_user', password: '1234' })
      .redirects(0);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/home');
  });

  // Username not found
  it("responds with 400 status and an error message of 'Username not found'", async () => {
    const res: Response = await request(server)
      .post('/login')
      .send({
        username: 'test_user_1',
        password: '1234',
      })
      .redirects(0);
    expect(res.status).toBe(400);
    expect(res.text).toContain('Username not found');
  });

  // Password Incorrect
  it("responds with 400 status and an error message of 'Password incorrect'", async () => {
    const res: Response = await request(server)
      .post('/login')
      .send({ username: 'test_user', password: '12345' })
      .redirects(0);
    expect(res.status).toBe(400);
    expect(res.text).toContain('Password incorrect');
  });
});

describe('POST /signup', () => {
  const testSignUp = {
    username: 'test_signup',
    email: 'test_signup@email.com',
    password: '1234',
  };

  afterEach(async () => {
    await db.query('DELETE FROM users WHERE username = $1;', ['test_signup']);
  });

  // successful signup
  it('responds with 302 status and redirects to /home', async () => {
    const res: Response = await request(server)
      .post('/signup')
      .send(testSignUp)
      .redirects(0);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/home');
  });

  // Username in use
  it("responds with 400 status and an error message of 'Username in use'", async () => {
    const res: Response = await request(server)
      .post('/signup')
      .send({
        username: testUser.username,
        email: 'test_signup1@email.com',
        password: '1234',
      })
      .redirects(0);
    expect(res.status).toBe(400);
    expect(res.text).toContain('Username in use');
  });

  // Email in use
  it("responds with 400 status and an error message of 'Email in use'", async () => {
    const res: Response = await request(server)
      .post('/signup')
      .send({
        username: 'test_signup_1',
        email: testUser.email,
        password: '1234',
      })
      .redirects(0);
    expect(res.status).toBe(400);
    expect(res.text).toContain('Email in use');
  });
});

describe('GET /home', () => {
  // no cookie, sent landing page
  it(
    'responds with 200 status and text/html content type ' +
      'and serves the landing page',
    async () => {
      const res: Response = await request(server).get('/home');
      expect(res.status).toBe(200);
      expect(res.text).toContain('<body id="landing-page">');
      expect(res.type).toMatch(/text\/html/);
    }
  );

  // has cookie, sent react app
  it(
    'responds with 200 status and text/html content type ' +
      'and serves the react app',
    async () => {
      const res: Response = await request(server)
        .get('/home')
        .set('Cookie', `sessionID=${sessionId}`);
      expect(res.text).toContain('<div id="root">');
      expect(res.type).toMatch(/text\/html/);
    }
  );
});

describe('POST /update-profile', () => {
  //succuss
  it('responds with 200 status and application/json content type', async () => {
    const res: Response = await request(server)
      .post('/update-profile')
      .set('Cookie', `sessionID=${sessionId}`)
      .send({ userImage: testImageBuffer });
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/application\/json/);
    const { imageUrl } = res.body;
    expect(imageUrl).toMatch('https://reactraft.s3.amazonaws.com/');

    const userQueryRes: { rows: { profile_image: string }[] } = await db.query(
      'SELECT profile_image FROM users WHERE _id = $1;',
      [testUser._id]
    );
    expect(imageUrl).toEqual(userQueryRes.rows[0].profile_image);
    imagesToDelete.push(imageUrl);
  });

  // when there is no cookie
  it(
    'responds with 500 status and application/json content type ' +
      ' and Cookie error message',
    async () => {
      const res: Response = await request(server)
        .post('/update-profile')
        .send({ userImage: testImageBuffer });
      expect(res.status).toBe(500);
      expect(res.type).toMatch(/application\/json/);
      expect(res.body).toContain('Cookie err');
    }
  );
});

describe('/designs', () => {
  describe('POST /new', () => {
    const clientId =
      Date.now().toString(36) + Math.random().toString(36).substring(2);

    it('responds with 200 status with application/json content type', async () => {
      const res: Response = await request(server)
        .post('/designs/new')
        .set('Cookie', `sessionID=${sessionId}`)
        .send({
          userImage: testImageBuffer,
          imageHeight: 100,
          clientId,
        });
      expect(res.status).toBe(200);
      expect(res.type).toMatch(/application\/json/);

      const design = res.body;
      expect(design).toHaveProperty('user_id', testUser._id);
      expect(design).toHaveProperty('title', 'Untitled');
      expect(design).toHaveProperty('created_at');
      expect(design).toHaveProperty('last_updated');
      expect(design).toHaveProperty('last_updated_by', testUser.username);

      const { pages, _id, image_url } = design;
      expect(pages.length).toBe(1);
      expect(pages[0]).toHaveProperty('_id');
      expect(pages[0]).toHaveProperty('design_id', _id);
      expect(pages[0]).toHaveProperty('index', 0);
      expect(pages[0]).toHaveProperty('image_url', image_url);

      const { components } = pages[0];
      expect(components.length).toBe(1);
      expect(components[0]).toHaveProperty('name', 'Page0');
      expect(components[0]).toHaveProperty('page_id', pages[0]._id);
      expect(components[0]).toHaveProperty('parent_id', null);
      expect(components[0]).toHaveProperty('index', 0);
      expect(components[0]).toHaveProperty('html_tag', '<div>');
      expect(components[0]).toHaveProperty('inner_html', '');
      expect(components[0]).toHaveProperty('props', '{}');
      expect(components[0]).toHaveProperty('styles', '{}');

      const { rectangle } = components[0];
      expect(rectangle).toHaveProperty('component_id', components[0]._id);
      expect(rectangle).toHaveProperty('x_position', '0.00');
      expect(rectangle).toHaveProperty('y_position', '0.00');
      expect(rectangle).toHaveProperty('z_index', 0);
      expect(rectangle).toHaveProperty('width');
      expect(rectangle).toHaveProperty('height', '100.00');
      expect(rectangle).toHaveProperty('border_width', 3);
      expect(rectangle).toHaveProperty('border_radius', null);
      expect(rectangle).toHaveProperty('stroke', 'black');
      expect(rectangle).toHaveProperty('background_color', null);

      imagesToDelete.push(design.image_url);
    });

    // No cookie
    it(
      'responds with 500 status and application/json content type ' +
        ' and Cookie error message',
      async () => {
        const res: Response = await request(server).post('/designs/new').send({
          userImage: testImageBuffer,
          imageHeight: 100,
          clientId,
        });
        expect(res.status).toBe(500);
        expect(res.type).toMatch(/application\/json/);
        expect(res.body).toContain('Cookie err');
      }
    );

    // When no valid userId is found
    it(
      'responds with 500 status and application/json content type ' +
        ' and addDesign error message',
      async () => {
        const res: Response = await request(server)
          .post('/designs/new')
          .set('Cookie', `sessionID=${encrypt('0')}`)
          .send({
            userImage: testImageBuffer,
            imageHeight: 100,
            clientId,
          });
        expect(res.status).toBe(500);
        expect(res.type).toMatch(/application\/json/);
        expect(res.body).toContain('UserId not found');
      }
    );

    // No client Id
    it(
      'responds with 500 status and application/json content type ' +
        ' and addDesign error message',
      async () => {
        const res: Response = await request(server)
          .post('/designs/new')
          .set('Cookie', `sessionID=${sessionId}`)
          .send({
            userImage: testImageBuffer,
            imageHeight: 100,
          });
        expect(res.status).toBe(500);
        expect(res.type).toMatch(/application\/json/);
        expect(res.body).toContain('clientId required');
      }
    );
  });

  describe('POST /update/:designId', () => {
    let testDesign: DesignRow;
    const testImageUrl2 = 'https://reactraft.s3.amazonaws.com/test2.JPG';

    beforeAll(async () => {
      const designQueryRes: DesignQueryRes = await db.query(
        'INSERT INTO designs (user_id, title, image_url) VALUES( $1, $2, $3) RETURNING *;',
        [
          testUser._id,
          'TestDesign',
          'https://reactraft.s3.amazonaws.com/test.png',
        ]
      );
      testDesign = designQueryRes.rows[0];
    });

    // update cover
    it('responds with 200 status and application/json content type', async () => {
      const res: Response = await request(server)
        .post(`/designs/update/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ imageUrl: testImageUrl2 });
      expect(res.status).toBe(200);
      expect(res.type).toMatch(/application\/json/);
      expect(res.body.message).toBe('updated design successfully');
      const updatedDesignRes: DesignQueryRes = await db.query(
        'SELECT * FROM designs WHERE _id = $1;',
        [testDesign._id]
      );
      const updatedDesign: DesignRow = updatedDesignRes.rows[0];
      expect(updatedDesign._id).toBe(testDesign._id);
      expect(updatedDesign.title).toBe(testDesign.title);
      expect(updatedDesign.user_id).toBe(testDesign.user_id);
      expect(updatedDesign.created_at).toEqual(testDesign.created_at);
      expect(updatedDesign.last_updated_by).toBe(testUser.username);
      expect(updatedDesign.image_url).toBe(testImageUrl2);
      expect(updatedDesign.last_updated).not.toEqual(testDesign.last_updated);
    });

    // update title
    it('responds with 200 status and application/json content type', async () => {
      const res: Response = await request(server)
        .post(`/designs/update/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ title: 'New Title' });
      expect(res.status).toBe(200);
      expect(res.type).toMatch(/application\/json/);
      expect(res.body.message).toBe('updated design successfully');
      const updatedDesignRes: DesignQueryRes = await db.query(
        'SELECT * FROM designs WHERE _id = $1;',
        [testDesign._id]
      );
      const updatedDesign: DesignRow = updatedDesignRes.rows[0];
      expect(updatedDesign._id).toBe(testDesign._id);
      expect(updatedDesign.title).toBe('New Title');
      expect(updatedDesign.user_id).toBe(testDesign.user_id);
      expect(updatedDesign.created_at).toEqual(testDesign.created_at);
      expect(updatedDesign.last_updated_by).toBe(testUser.username);
      expect(updatedDesign.image_url).toBe(testImageUrl2);
      expect(updatedDesign.last_updated).not.toEqual(testDesign.last_updated);
    });
  });
});
