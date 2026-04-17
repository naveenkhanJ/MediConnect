const { Client } = require('pg');

async function check() {
  const client = new Client({ connectionString: 'postgres://postgres:postgres123@localhost:5432/notification_db' });
  await client.connect();
  const id = '250a0225-5c10-4e10-8f88-44dea3563c4d';
  const res = await client.query(`SELECT * FROM notification_logs WHERE "appointmentId" = '${id}'`);
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
}
check();
