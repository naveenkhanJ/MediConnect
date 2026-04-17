const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('doctor_db', 'postgres', 'postgres123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

async function check() {
  try {
    const [results] = await sequelize.query("SELECT * FROM availabilities ORDER BY date ASC");
    console.log("Total records:", results.length);
    console.log("Data:", JSON.stringify(results, null, 2));
  } catch(e) {
    console.error("Error:", e.message);
  } finally {
    await sequelize.close();
  }
}
check();
