const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('doctor_db', 'postgres', 'postgres123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

async function check() {
  try {
    const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables:', results);
  } catch(e) { console.error(e.message); }
  finally { sequelize.close(); }
}
check();
