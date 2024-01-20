const request = require('supertest');
const server = 'http://localhost:3000';
const db = require('../server/models/dbModel');
const s3 = require('../server/models/s3Model');
const { encrypt } = require('../server/helpers/encryptDecrypt');
const path = require('path');
const fs = require('fs');

let testUserId;
let sessionId;
const testUser = {
  username: 'test_user',
  email: 'test_user@123.com',
  password: '1234',
};

beforeAll(async () => {
  const { username, email, password } = testUser;
  const testUserResponse = await db.query(
    'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;',
    [username, email]
  );
  testUserId = testUserResponse.rows[0]._id;
  sessionId = encrypt(String(testUserId));

  await db.query(
    "INSERT INTO passwords (user_id, hashed_psw) VALUES ($1, crypt($2, gen_salt('md5')));",
    [testUserId, password]
  );
});

describe('/user', () => {
  it('should respond with 200 status and application/json content type', () => {
    return request(server)
      .get('/user')
      .set('Cookie', `sessionID=${sessionId}`)
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect((res) => {
        const { _id, username, email, created_at, last_login } = res.body;
        expect(_id).toEqual(testUserId);
        expect(username).toEqual('test_user');
        expect(email).toEqual('test_user@123.com');
        expect(new Date(created_at)).toBeInstanceOf(Date);
        expect(new Date(last_login)).toBeInstanceOf(Date);
      });
  });

  // when there is no cookie
  it(
    'should respond with 500 status and application/json content type ' +
      ' and Cookie error message',
    () => {
      return request(server)
        .get('/user')
        .expect('Content-Type', /application\/json/)
        .expect(500)
        .expect((res) => {
          expect(res.body).toContain('Cookie err');
        });
    }
  );

  it(
    'should respond with 400 status and application/json content type ' +
      'and a getUser error message',
    () => {
      return request(server)
        .get('/user')
        .set('Cookie', `sessionID=${encrypt('test')}`)
        .expect('Content-Type', /application\/json/)
        .expect(500)
        .expect((res) => {
          expect(res.body).toContain('getUser');
        });
    }
  );
});

describe('/update-profile', () => {
  const filePath = path.join(__dirname, './test.png');
  const fileData = fs.readFileSync(filePath);
  const base64Image = Buffer.from(fileData).toString('base64');
  let onlineUrl;

  it('should respond with 200 status and application/json content type', () => {
    return request(server)
      .post('/update-profile')
      .set('Cookie', `sessionID=${sessionId}`)
      .send({ userImage: base64Image })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect((res) => {
        const { imageUrl } = res.body;
        onlineUrl = imageUrl;
        expect(imageUrl).toMatch('https://reactraft.s3.amazonaws.com/');
      });
  });

  it(
    'should respond with 500 status and application/json content type ' +
      ' and Cookie error message',
    () => {
      return request(server)
        .post('/update-profile')
        .send({ userImage: base64Image })
        .expect('Content-Type', /application\/json/)
        .expect(500)
        .expect((res) => {
          expect(res.body).toContain('Cookie err');
        });
    }
  );

  it('should respond with 200 status and application/json content type', () => {
    return request(server)
      .post('/update-profile')
      .set('Cookie', `sessionID=${sessionId}`)
      .send({ userImage: base64Image, imageToDelete: onlineUrl })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect((res) => {
        const { imageUrl } = res.body;
        onlineUrl = imageUrl;
        expect(imageUrl).toMatch('https://reactraft.s3.amazonaws.com/');
      });
  });

  afterAll(async () => {
    if (onlineUrl) {
      await s3.deleteObject({ Bucket: 'reactraft', Key: onlineUrl });
    }
  });
});

afterAll(async () => {
  await db.query('DELETE FROM passwords WHERE user_id = $1;', [testUserId]);
  await db.query('DELETE FROM users WHERE _id = $1;', [testUserId]);
});
