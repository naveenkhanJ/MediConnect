import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('--- Starting Migration: Add is_approved to users ---');

    // 1. Add column if it doesn't exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT TRUE
    `);
    console.log('✅ Column is_approved added (or already exists).');

    // 2. Backfill existing users: make all currently registered users approved
    await client.query(`
      UPDATE users SET is_approved = TRUE WHERE is_approved IS NULL
    `);
    console.log('✅ Existing users marked as approved.');

    // 3. Set default to FALSE for future doctors (we will handle this in code too, 
    // but good practice to have logic in DB if role was available here)
    // However, since default is TRUE (for patients), we'll handle doctor-specific default in registerService.

    console.log('--- Migration Completed Successfully ---');
  } catch (err) {
    console.error('❌ Migration Failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
