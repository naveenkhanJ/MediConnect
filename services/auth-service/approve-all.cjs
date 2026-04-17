const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: 'c:/Users/Naveen/Desktop/MediConnect/services/auth-service/.env' });

async function checkUsers() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();
    // Approve all existing users
    const res = await client.query("UPDATE users SET is_approved = true WHERE is_approved = false OR is_approved IS NULL");
    console.log(`Approved ${res.rowCount} users.`);
    
    // Check admin
    const adminRes = await client.query("SELECT * FROM users WHERE email = 'admin@mediconnect.com'");
    console.log('Admin User:', adminRes.rows[0]);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

checkUsers();
