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
  username: `test_design_${Date.now()}`,
  email: `test_design_${Date.now()}@123.com`,
};

const testImage = fs.readFileSync(path.join(__dirname, './test.png'));
const testImageBuffer = Buffer.from(testImage).toString('base64');

beforeAll(async () => {
  const { username, email } = testUser;
  const testUserResponse = await db.query(
    'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;',
    [username, email]
  );
  testUserId = testUserResponse.rows[0]._id;
  sessionId = encrypt(String(testUserId));
});

afterAll(async () => {
  await db.query('DELETE FROM users WHERE _id = $1;', [testUserId]);
});

describe('/designs', () => {
  // test for making a new design
  describe('/new', () => {
    let testImageUrl;
    let testDesignId;
    let testRootComponentId;

    // success
    it('responds with 200 status with application/json content type', async () => {
      const testRes = await request(server)
        .post('/designs/new')
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ userImage: testImageBuffer, imageHeight: 100 })
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
      } = testRes.body;

      expect(components.length).toEqual(1);
      expect(components[0].name).toEqual('RootContainer');
      expect(components[0].rectangle).toBeTruthy();

      const dbRes = await db.query(
        'SELECT * FROM designs WHERE user_id = $1;',
        [testUserId]
      );

      expect(dbRes.rows.length).toEqual(1);
      expect(
        JSON.stringify({
          _id,
          user_id,
          title,
          created_at,
          last_updated,
          image_url,
        })
      ).toEqual(JSON.stringify(dbRes.rows[0]));

      testImageUrl = image_url;
      testDesignId = _id;
      testRootComponentId = components[0]._id;
    });

    // When there is no cookie
    it(
      'should respond with 500 status and application/json content type ' +
        ' and Cookie error message',
      () => {
        return request(server)
          .post('/designs/new')
          .send({ userImage: testImageBuffer, imageHeight: 100 })
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
          .send({ userImage: testImageBuffer, imageHeight: 100 })
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .expect((res) => {
            expect(res.body.err).toContain('addDesign: ');
          });
      }
    );

    afterEach(async () => {
      if (testImageUrl)
        s3.deleteObject({ Bucket: 'reactraft', Key: testImageUrl });
      if (testRootComponentId)
        await db.query('DELETE FROM rectangles WHERE component_id = $1;', [
          testRootComponentId,
        ]);
      if (testDesignId) {
        await db.query('DELETE FROM components WHERE design_id = $1;', [
          testDesignId,
        ]);
        await db.query('DELETE FROM designs WHERE _id = $1;', [testDesignId]);
      }
    });
  });

  // test for updatel, add new design tests must pass first
  describe('/update/:designId', () => {
    let testDesign;

    beforeEach(async () => {
      const response = await request(server)
        .post('/designs/new')
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ userImage: testImageBuffer, imageHeight: 100 });
      testDesign = response.body;
    });

    afterEach(async () => {
      if (testDesign) {
        s3.deleteObject({ Bucket: 'reactraft', Key: testDesign.image_url });
        if (testDesign.components[0])
          await db.query('DELETE FROM rectangles WHERE component_id = $1;', [
            testDesign.components[0]._id,
          ]);
        await db.query('DELETE FROM components WHERE design_id = $1;', [
          testDesign._id,
        ]);
        await db.query('DELETE FROM designs WHERE _id = $1;', [testDesign._id]);
      }
    });

    // success updating image
    it('should respond with 200 status and application/json content type', () => {
      return request(server)
        .post(`/designs/update/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .send({
          userImage: testImageBuffer,
          imageToDelete: testDesign.image_url,
        })
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

    // success updating title
    it('should respond with 200 status and application/json content type', () => {
      return request(server)
        .post(`/designs/update/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .send({
          title: 'new_title',
        })
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
  });

  // get designs for users. Need to pass tests for /new first
  describe('/get', () => {
    let testDesign0;
    let testDesign1;
    beforeEach(async () => {
      const response0 = await request(server)
        .post('/designs/new')
        .set('Cookie', `sessionID=${sessionId}`)
        .send({
          userImage: testImageBuffer,
          imageWidth: 100,
          imageHeight: 100,
        });
      testDesign0 = response0.body;
      const response1 = await request(server)
        .post('/designs/new')
        .set('Cookie', `sessionID=${sessionId}`)
        .send({
          userImage: testImageBuffer,
          imageWidth: 100,
          imageHeight: 100,
        });
      testDesign1 = response1.body;
    });

    afterEach(async () => {
      if (testDesign0) {
        await db.query('DELETE FROM rectangles WHERE component_id = $1;', [
          testDesign0.components[0]._id,
        ]);

        await db.query('DELETE FROM components WHERE design_id = $1;', [
          testDesign0._id,
        ]);
        await db.query('DELETE FROM designs WHERE _id = $1;', [
          testDesign0._id,
        ]);
        s3.deleteObject({ Bucket: 'reactraft', Key: testDesign0.image_url });
      }
      if (testDesign1) {
        await db.query('DELETE FROM rectangles WHERE component_id = $1;', [
          testDesign1.components[0]._id,
        ]);

        await db.query('DELETE FROM components WHERE design_id = $1;', [
          testDesign1._id,
        ]);
        await db.query('DELETE FROM designs WHERE _id = $1;', [
          testDesign1._id,
        ]);
        s3.deleteObject({ Bucket: 'reactraft', Key: testDesign0.image_url });
      }
    });

    it('should respond with 200 status with and application/json content type', () => {
      return request(server)
        .get('/designs/get')
        .set('Cookie', `sessionID=${sessionId}`)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect((res) => {
          const designs = res.body;
          designs.sort((a, b) => a._id - b._id);
          expect(designs.length).toEqual(2);

          expect(designs[0]._id).toEqual(testDesign0._id);
          expect(designs[1]._id).toEqual(testDesign1._id);

          expect(designs[0].user_id).toEqual(designs[1].user_id);
          expect(designs[0].user_id).toEqual(testUserId);

          expect(designs[1].title).toEqual(designs[0].title);
          expect(designs[1].title).toEqual('Untitled');

          expect(designs[0].created_at).toEqual(testDesign0.created_at);
          expect(designs[1].created_at).toEqual(testDesign1.created_at);

          expect(designs[0].last_updated).toEqual(testDesign0.last_updated);
          expect(designs[1].last_updated).toEqual(testDesign1.last_updated);

          expect(designs[0].image_url).toEqual(testDesign0.image_url);
          expect(designs[1].image_url).toEqual(testDesign1.image_url);
        });
    });

    //no cookie
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
  });

  describe('/new-component/:designId', () => {
    let testDesign;

    beforeEach(async () => {
      const response = await request(server)
        .post('/designs/new')
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ userImage: testImageBuffer, imageHeight: 100 });
      testDesign = response.body;
    });

    //successfully add a new component
    it('should respond with 200 status with and application/json content type', async () => {
      const testRes = await request(server)
        .post(`/designs/new-component/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .send({
          name: 'newComponent',
          index: 1,
          rootId: testDesign.components[0]._id,
        })
        .expect('Content-Type', /application\/json/)
        .expect(200);
      const {
        _id,
        design_id,
        parent_id,
        index,
        name,
        html_tag,
        inner_html,
        props,
        styles,
        created_at,
        rectangle,
      } = testRes.body;
      const dbCompRes = await db.query(
        'SELECT * FROM components WHERE _id = $1;',
        [_id]
      );
      expect(dbCompRes.rows.length).toEqual(1);
      const dbRectRes = await db.query(
        'SELECT * FROM rectangles WHERE component_id = $1;',
        [_id]
      );
      expect(dbRectRes.rows.length).toEqual(1);

      expect(design_id).toEqual(testDesign._id);
      expect(parent_id).toEqual(testDesign.components[0]._id);
      expect(index).toEqual(1);
      expect(name).toEqual('newComponent');
      expect(html_tag).toEqual('<div>');
      expect(inner_html).toEqual('');
      expect(props).toEqual('{}');
      expect(styles).toEqual('{}');
      expect(new Date(created_at)).toBeInstanceOf(Date);
      expect(rectangle.component_id).toEqual(_id);
      expect(rectangle.x_position).toEqual('0.00');
      expect(rectangle.y_position).toEqual('0.00');
      expect(rectangle.width).toEqual('100.00');
      expect(rectangle.height).toEqual('100.00');
      expect(rectangle.stroke).toEqual('black');
    });

    //no cookie
    it(
      'should respond with 500 status and application/json content type ' +
        ' and Cookie error message',
      () => {
        return request(server)
          .post(`/designs/new-component/${testDesign._id}`)
          .send({
            name: 'newComponent',
            index: 1,
            rootId: testDesign.components[0]._id,
          })
          .expect(500)
          .expect((res) => {
            expect(res.body).toContain('Cookie err');
          });
      }
    );

    afterEach(async () => {
      if (testDesign) {
        s3.deleteObject({ Bucket: 'reactraft', Key: testDesign.image_url });

        const compRes = await db.query(
          'SELECT * FROM components WHERE design_id = $1;',
          [testDesign._id]
        );
        if (testDesign.components) {
          const componentIds = compRes.rows.map((item) => item._id);
          await db.query(
            'DELETE FROM rectangles WHERE component_id = ANY($1);',
            [componentIds]
          );
        }
        await db.query('DELETE FROM components WHERE design_id = $1;', [
          testDesign._id,
        ]);
        await db.query('DELETE FROM designs WHERE _id = $1;', [testDesign._id]);
      }
    });
  });

  // test the delete design feature; need to pass /new /new-components tests first
  describe('/delete/:designId', () => {
    let testDesign;

    beforeEach(async () => {
      const response = await request(server)
        .post('/designs/new')
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ userImage: testImageBuffer, imageHeight: 100 });
      testDesign = response.body;
    });

    // successfully delete when there is only one default rootcontainer
    it('should respond with 200 status with and application/json content type', () => {
      return request(server)
        .delete(`/designs/delete/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .expect('Content-Type', /application\/json/)
        .expect(200);
    });

    // successfully delete when there are more than one components, need to pass /new-components tests first
    it('should respond with 200 status with and application/json content type', async () => {
      await request(server)
        .post(`/designs/new-component/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .send({
          name: 'newComponent',
          index: 1,
          rootId: testDesign.components[0]._id,
        });
      await request(server)
        .post(`/designs/new-component/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .send({
          name: 'newComponent',
          index: 1,
          rootId: testDesign.components[0]._id,
        });
      return request(server)
        .delete(`/designs/delete/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .expect('Content-Type', /application\/json/)
        .expect(200);
    });

    afterEach(async () => {
      s3.deleteObject({ Bucket: 'reactraft', Key: testDesign.image_url });
      const compRes = await db.query(
        'SELECT * FROM components WHERE design_id = $1;',
        [testDesign._id]
      );
      if (testDesign.components) {
        const componentIds = compRes.rows.map((item) => item._id);
        await db.query('DELETE FROM rectangles WHERE component_id = ANY($1);', [
          componentIds,
        ]);
      }
      await db.query('DELETE FROM components WHERE design_id = $1;', [
        testDesign._id,
      ]);
      await db.query('DELETE FROM designs WHERE _id = $1;', [testDesign._id]);
    });
  });

  // test the get design details feature; need to pass /new, /new-components tests first
  describe('/detail/:designId', () => {
    let testDesign;

    beforeEach(async () => {
      const response = await request(server)
        .post('/designs/new')
        .set('Cookie', `sessionID=${sessionId}`)
        .send({ userImage: testImageBuffer, imageHeight: 100 });
      testDesign = response.body;
    });

    // successfully get detail when there is only one default rootcontainer
    it('should respond with 200 status with and application/json content type', () => {
      return request(server)
        .get(`/designs/details/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect((res) => expect(res.body).toEqual(testDesign));
    });

    // successfully delete when there are more than one components, need to pass /new-components tests first
    it('should respond with 200 status with and application/json content type', async () => {
      const newCompRes1 = await request(server)
        .post(`/designs/new-component/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .send({
          name: 'newComponent1',
          index: 1,
          rootId: testDesign.components[0]._id,
        });
      const newCompRes2 = await request(server)
        .post(`/designs/new-component/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .send({
          name: 'newComponent2',
          index: 1,
          rootId: testDesign.components[0]._id,
        });

      testDesign.components.push(newCompRes1.body);
      testDesign.components.push(newCompRes2.body);
      return request(server)
        .get(`/designs/details/${testDesign._id}`)
        .set('Cookie', `sessionID=${sessionId}`)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect((res) => expect(res.body).toEqual(testDesign));
    });

    afterEach(async () => {
      s3.deleteObject({ Bucket: 'reactraft', Key: testDesign.image_url });
      const compRes = await db.query(
        'SELECT * FROM components WHERE design_id = $1;',
        [testDesign._id]
      );
      if (testDesign.components) {
        const componentIds = compRes.rows.map((item) => item._id);
        await db.query('DELETE FROM rectangles WHERE component_id = ANY($1);', [
          componentIds,
        ]);
      }
      await db.query('DELETE FROM components WHERE design_id = $1;', [
        testDesign._id,
      ]);
      await db.query('DELETE FROM designs WHERE _id = $1;', [testDesign._id]);
    });
  });
});
