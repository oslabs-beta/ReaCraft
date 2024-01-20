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
  username: 'test_design5',
  email: 'test_design3341@1234.com',
};

const testImage = fs.readFileSync(path.join(__dirname, './test.png'));
const base64Image = Buffer.from(testImage).toString('base64');

beforeAll(async () => {
  const { username, email } = testUser;
  const testUserResponse = await db.query(
    'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;',
    [username, email]
  );
  testUserId = testUserResponse.rows[0]._id;
  sessionId = encrypt(String(testUserId));
});

describe('/designs', () => {
  // test for making a new design
  describe('/new', () => {
    let testOnlineUrl;
    let newDesignId;
    let newRootComponentId;

    // success
    it('should respond with 200 status with and application/json content type', async () => {
      const response = await request(server)
        .post('/designs/new')
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ userImage: base64Image, imageWidth: 100, imageHeight: 100 })
        .expect('Content-Type', /application\/json/)
        .expect(200);
      const {
        _id,
        user_id,
        title,
        created_at,
        last_updated,
        image_url,
        components,
      } = response.body;
      const designsResponse = await db.query(
        'SELECT * FROM designs WHERE user_id = $1;',
        [testUserId]
      );
      expect(designsResponse.rows.length).toEqual(1);
      expect(JSON.stringify(designsResponse.rows[0])).toEqual(
        JSON.stringify({
          _id,
          user_id,
          title,
          created_at,
          last_updated,
          image_url,
        })
      );
      expect(components.length).toEqual(1);
      expect(components[0].name).toEqual('RootContainer');
      expect(components[0].rectangle).toBeTruthy();
      testOnlineUrl = image_url;
      newDesignId = _id;
      newRootComponentId = components[0]._id;
    });

    // When there is no cookie
    it(
      'should respond with 500 status and application/json content type ' +
        ' and Cookie error message',
      () => {
        return request(server)
          .post('/designs/new')
          .send({ userImage: base64Image, imageWidth: 100, imageHeight: 100 })
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .expect((res) => {
            expect(res.body).toContain('Cookie err');
          });
      }
    );

    // When no valid userId is found
    it(
      'should respond with 500 status and application/json content type ' +
        ' and addDesign error message',
      () => {
        return request(server)
          .post('/designs/new')
          .set('Cookie', `sessionID=${encrypt('test')}`)
          .send({ userImage: base64Image, imageWidth: 100, imageHeight: 100 })
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .expect((res) => {
            expect(res.body.err).toContain('addDesign: ');
          });
      }
    );

    afterAll(async () => {
      s3.deleteObject({ Bucket: 'reactraft', Key: testOnlineUrl });
      await db.query('DELETE FROM rectangles WHERE component_id = $1;', [
        newRootComponentId,
      ]);
      await db.query('DELETE FROM components WHERE design_id = $1;', [
        newDesignId,
      ]);
    });
  });

  // update design image, add new design tests must pass first
  describe('/update/:designId', () => {
    // set up testDesign
    let testDesign;
    beforeAll(async () => {
      const response = await request(server)
        .post('/designs/new')
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ userImage: base64Image, imageWidth: 100, imageHeight: 100 });
      testDesign = response.body;
    });

    it('should respond with 200 status and application/json content type', () => {
      return request(server)
        .post(`/designs/update/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ userImage: base64Image, imageToDelete: testDesign.image_url })
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect((res) => {
          const { _id, user_id, title, created_at, last_updated, image_url } =
            res.body;
          expect(_id).toEqual(testDesign._id);
          expect(user_id).toEqual(testUserId);
          expect(title).toEqual('Untitled');
          expect(created_at).toEqual(testDesign.created_at);
          expect(new Date(last_updated)).toBeInstanceOf(Date);
          expect(last_updated).not.toEqual(testDesign.last_updated);
          expect(image_url).not.toEqual(testDesign.image_url);
          testDesign.image_url = image_url;
        });
    });

    // update title
    it('should respond with 200 status and application/json content type', () => {
      return request(server)
        .post(`/designs/update/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ title: 'new_title' })
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect((res) => {
          const { _id, user_id, title, created_at, last_updated, image_url } =
            res.body;
          expect(_id).toEqual(testDesign._id);
          expect(user_id).toEqual(testUserId);
          expect(title).toEqual('new_title');
          expect(created_at).toEqual(testDesign.created_at);
          expect(new Date(last_updated)).toBeInstanceOf(Date);
          expect(last_updated).not.toEqual(testDesign.last_updated);
          expect(image_url).toEqual(testDesign.image_url);
        });
    });

    // No cookie
    it(
      'should respond with 500 status and application/json content type ' +
        ' and Cookie error message',
      () => {
        return request(server)
          .post(`/designs/update/${testDesign._id}`)
          .send({ title: 'new_title' })
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .expect((res) => {
            expect(res.body).toContain('Cookie err');
          });
      }
    );

    // Non-valid designId
    it(
      'should respond with 500 status and application/json content type ' +
        ' and Cookie error message',
      () => {
        return request(server)
          .post('/designs/update/test')
          .set('Cookie', `sessionID=${sessionId}`)
          .send({ title: 'new_title' })
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .expect((res) => {
            expect(res.body.err).toContain('updateDesign: error');
          });
      }
    );

    afterAll(async () => {
      if (testDesign) {
        await db.query('DELETE FROM rectangles WHERE component_id = $1;', [
          testDesign.components[0]._id,
        ]);
        await db.query('DELETE FROM components WHERE design_id = $1;', [
          testDesign._id,
        ]);
        s3.deleteObject({ Bucket: 'reactraft', Key: testDesign.image_url });
      }
    });
  });

  describe('/get', () => {
    let testDesign0;
    let testDesign1;
    beforeAll(async () => {
      const response0 = await request(server)
        .post('/designs/new')
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ userImage: base64Image, imageWidth: 100, imageHeight: 100 });
      testDesign0 = response0.body;
      const response1 = await request(server)
        .post('/designs/new')
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ userImage: base64Image, imageWidth: 100, imageHeight: 100 });
      testDesign1 = response1.body;
    });

    it('should respond with 200 status with and application/json content type', () => {
      return request(server)
        .get('/designs/get')
        .set('Cookie', `sessionID=${sessionId}`)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect((res) => {
          const designs = res.body;
          console.log('designs are', designs);
          expect(designs.length).toEqual(4);

          expect(designs[2]._id).toEqual(testDesign0._id);
          expect(designs[3]._id).toEqual(testDesign1._id);

          expect(designs[2].user_id).toEqual(designs[3].user_id);
          expect(designs[2].user_id).toEqual(testUserId);

          expect(designs[2].title).toEqual(designs[3].title);
          expect(designs[2].title).toEqual('Untitled');

          expect(new Date(designs[2].created_at)).toEqual(
            new Date(testDesign0.created_at)
          );
          expect(new Date(designs[3].created_at)).toEqual(
            new Date(testDesign1.created_at)
          );

          expect(new Date(designs[2].last_updated)).toEqual(
            new Date(testDesign0.last_updated)
          );
          expect(new Date(designs[3].last_updated)).toEqual(
            new Date(testDesign1.last_updated)
          );

          expect(designs[2].image_url).toEqual(testDesign0.image_url);
          expect(designs[3].image_url).toEqual(testDesign1.image_url);
        });
    });

    it(
      'should respond with 500 status and application/json content type ' +
        ' and Cookie error message',
      () => {
        return request(server)
          .get('/designs/get')
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .expect((res) => {
            expect(res.body).toContain('Cookie err');
          });
      }
    );

    afterAll(async () => {
      if (testDesign0) {
        await db.query(
          'DELETE FROM rectangles WHERE component_id = $1 OR component_id = $2;',
          [testDesign0.components[0]._id, testDesign1.components[0]._id]
        );
        s3.deleteObject({ Bucket: 'reactraft', Key: testDesign0.image_url });
      }
      if (testDesign1) {
        await db.query(
          'DELETE FROM components WHERE design_id = $1 OR design_id = $2;',
          [testDesign0._id, testDesign1._id]
        );
        s3.deleteObject({ Bucket: 'reactraft', Key: testDesign1.image_url });
      }
    });
  });

  // describe('/details/:designId', async () => {
  //   await
  // });
});

afterAll(async () => {
  await db.query('DELETE FROM designs WHERE user_id = $1;', [testUserId]);
  await db.query('DELETE FROM users WHERE _id = $1;', [testUserId]);
});
