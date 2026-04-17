const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: 'c:/Users/Naveen/Desktop/MediConnect/services/doctor-service/.env' });

async function checkSchema() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'doctors' AND column_name = 'id'
    `);
    console.log('ID Column Type:', res.rows[0]);
    
    // If it's still uuid, attempt to drop and re-create it as integer
    if (res.rows[0] && res.rows[0].data_type === 'uuid') {
       console.log('Detected UUID type, attempting to drop table for clean sync...');
       await client.query('DROP TABLE IF EXISTS doctors CASCADE');
       console.log('Table dropped. Sequelize sync should recreate it as INTEGER on service restart.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

checkSchema();
