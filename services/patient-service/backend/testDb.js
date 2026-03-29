import dotenv from 'dotenv';
dotenv.config();

import pool from './src/config/db.js'; // <-- correct path

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    console.log('Database:', process.env.DB_NAME);

    const result = await client.query('SELECT NOW()');
    console.log('✅ Query successful! Current time:', result.rows[0].now);

    client.release();
    pool.end();
  } catch (err) {
    console.error('❌ Database connection/query failed:');
    console.error('Error:', err.message);
    pool.end();
  }
}

testConnection();