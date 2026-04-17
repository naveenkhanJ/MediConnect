const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres123@localhost:5432/appointment_db');
sequelize.query('SELECT id, "doctorId", status, "docStatus" FROM appointments;').then(res => { console.log(res[0]); process.exit(0); }).catch(console.error);
