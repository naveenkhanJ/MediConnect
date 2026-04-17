const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres123@localhost:5432/appointment_db');
sequelize.query("UPDATE appointments SET \"docStatus\" = 'PENDING' WHERE id = 'fdf3387b-2272-4786-ad81-117b53ba03b8'").then(() => { console.log('Reset successful'); process.exit(0); });
