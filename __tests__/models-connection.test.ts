import db from '../server/models/dbModel';
import s3 from '../server/models/s3Model';
import dotenv from 'dotenv';

dotenv.config();

describe('PostgresQL Database Connection', () => {
  it('should connect to the database successfully', async () => {
    expect.assertions(1);
    const query = 'SELECT NOW()';
    await expect(db.query(query)).resolves.not.toThrow();
  });

  afterAll(async () => {
    await db.end();
  });
});

describe('S3 Connection', () => {
  it('should list objects from a bucket', async () => {
    const params = {
      Bucket: 'reactraft', // Replace with your actual bucket name
    };

    try {
      const data = await s3.listObjectsV2(params).promise();
      expect(data).toHaveProperty('Contents');
    } catch (error) {
      console.error('Error accessing S3:', error);
      throw error;
    }
  });
});
