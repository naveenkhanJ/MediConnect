const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres123@localhost:5432/appointment_db');

async function debug() {
  const id = 'fdf3387b-2272-4786-ad81-117b53ba03b8';
  console.log("Checking status before reset...");
  const [before] = await sequelize.query(`SELECT "docStatus" FROM appointments WHERE id = '${id}'`);
  console.log("Status:", before[0].docStatus);

  console.log("Resetting...");
  await sequelize.query(`UPDATE appointments SET "docStatus" = 'PENDING' WHERE id = '${id}'`);
  
  const [after] = await sequelize.query(`SELECT "docStatus" FROM appointments WHERE id = '${id}'`);
  console.log("Status after reset:", after[0].docStatus);
  process.exit(0);
}
debug();
