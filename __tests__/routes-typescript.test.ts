import request, { Response } from 'supertest';
import db from '../server/models/dbModel';
import s3 from '../server/models/s3Model';
import { encrypt } from '../server/helpers/encryptDecrypt';
import path from 'path';
import fs from 'fs';
import { userQueryRes, userRow } from '../docs/types';

const server = 'http://localhost:3000';
const testUserData = {
  username: 'test_user',
  email: 'test_user@123.com',
  password: '1234',
};

let sessionId: string;
let testUser: userRow;

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
  await db.query('DELETE FROM users WHERE _id = $1;', [testUser._id]);
  await db.end();
});

describe('GET /user', () => {
  // successfully get user
  it('should respond with 200 status and application/json content type', async () => {
    const res: Response = await request(server)
      .get('/user')
      .set('Cookie', `sessionID=${sessionId}`);
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/application\/json/);
    expect(JSON.stringify(testUser)).toEqual(JSON.stringify(res.body));
  });

  // when there is no cookie
  it(
    'should respond with 500 status and application/json content type ' +
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
    'should respond with 400 status and application/json content type ' +
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
  const filePath = path.join(__dirname, './test.png');
  const fileData = fs.readFileSync(filePath);
  const base64Image = Buffer.from(fileData).toString('base64');
  let testImageUrl: string | undefined = undefined;

  afterEach(() => {
    if (testImageUrl) {
      s3.deleteObject({ Bucket: 'reactraft', Key: testImageUrl });
      testImageUrl = undefined;
    }
  });
  //succuss
  it('should respond with 200 status and application/json content type', async () => {
    const res: Response = await request(server)
      .post('/update-profile')
      .set('Cookie', `sessionID=${sessionId}`)
      .send({ userImage: base64Image });
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/application\/json/);
    const { imageUrl } = res.body;
    expect(imageUrl).toMatch('https://reactraft.s3.amazonaws.com/');

    const userQueryRes: { rows: { profile_image: string }[] } = await db.query(
      'SELECT profile_image FROM users WHERE _id = $1;',
      [testUser._id]
    );
    expect(imageUrl).toEqual(userQueryRes.rows[0].profile_image);
  });

  // when there is no cookie
  it(
    'should respond with 500 status and application/json content type ' +
      ' and Cookie error message',
    async () => {
      const res: Response = await request(server)
        .post('/update-profile')
        .send({ userImage: base64Image });
      expect(res.status).toBe(500);
      expect(res.type).toMatch(/application\/json/);
      expect(res.body).toContain('Cookie err');
    }
  );
});

describe('/designs', () => {});
