const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres123@localhost:5432/appointment_db');
sequelize.query("SELECT * FROM appointments WHERE id = 'fdf3387b-2272-4786-ad81-117b53ba03b8'").then(res => { console.log(JSON.stringify(res[0], null, 2)); process.exit(0); });
