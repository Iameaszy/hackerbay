const Sequelize = require('sequelize');
const { DB_PASS } = process.env;
const sequelize = new Sequelize('postgres', 'postgres', '(62337087)', {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const start = () => {
  sequelize
    .authenticate()
    .then(() => console.log('Connection has been established successfully'))
    .catch((err) => {
      console.log('Unable to connect to the database:', err);
    });
};

module.exports = { db: { sequelize, Sequelize }, start };
