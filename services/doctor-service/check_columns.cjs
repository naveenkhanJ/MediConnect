const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('doctor_db', 'postgres', 'postgres123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

async function check() {
  try {
    const [results] = await sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'doctors'");
    console.log("--- DOCTOR TABLE COLUMNS ---");
    console.log(JSON.stringify(results, null, 2));
    console.log("----------------------------");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await sequelize.close();
  }
}

check();
