const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.PG_URI,
});

module.exports = {
  query: (text, params) => {
    return pool.query(text, params).catch((e) => {
      console.error('Error executing query', e.stack);
      throw e;
    });
  },
};
