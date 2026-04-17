import { Client } from 'pg';
const client = new Client('postgres://postgres:postgres123@localhost:5432/patient_db');
client.connect().then(async () => {
    const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'patients'");
    console.log(res.rows);
    client.end();
}).catch(console.error);
