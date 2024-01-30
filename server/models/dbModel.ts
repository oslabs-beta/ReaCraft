import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.PG_URI,
});

const query = (text: string, params?: any[]) => {
  return pool.query(text, params).catch((e) => {
    console.error('Error executing query', e.stack);
    throw e;
  });
};

export default { query };
