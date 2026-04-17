const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('notification_db', 'postgres', 'postgres123', { host: 'localhost', dialect: 'postgres' });
sequelize.query(`SELECT * FROM notification_logs ORDER BY "createdAt" DESC LIMIT 10;`)
  .then(([res]) => { console.log(JSON.stringify(res, null, 2)); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
