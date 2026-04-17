const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('doctor_db', 'postgres', 'postgres123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

async function check() {
  try {
    const res = await sequelize.query('SELECT * FROM "doctors"', { type: Sequelize.QueryTypes.SELECT });
    console.log("--- DOCTOR PROFILES ---");
    console.log(JSON.stringify(res, null, 2));
    console.log("-----------------------");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await sequelize.close();
  }
}

check();
