const { Client } = require('pg');
const client = new Client('postgres://postgres:postgres123@localhost:5432/auth_db');
client.connect().then(async () => {
    try {
        const res = await client.query("SELECT id, email, role, is_approved, created_at FROM users WHERE role='doctor'");
        console.log(res.rows);
    } catch(e) {
        console.error(e.message);
    }
    client.end();
});
