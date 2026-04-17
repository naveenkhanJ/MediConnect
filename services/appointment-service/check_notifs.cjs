const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres123@localhost:5432/notification_db');
sequelize.query('SELECT * FROM notification_logs ORDER BY "createdAt" DESC LIMIT 5;').then(res => { console.log(JSON.stringify(res[0], null, 2)); process.exit(0); }).catch(console.error);
