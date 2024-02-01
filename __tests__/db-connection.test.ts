import db from '../server/models/dbModel';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.PG_URI);

describe('Database Connection', () => {
  it('should connect to the database successfully', async () => {
    expect.assertions(1);
    const query = 'SELECT NOW()';
    await expect(db.query(query)).resolves.not.toThrow();
  });

  afterAll(async () => {
    await db.end();
  });
});
