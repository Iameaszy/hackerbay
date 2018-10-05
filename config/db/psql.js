const Sequelize = require('sequelize');
const logger = require('../winston');

const {
  DB_PASS,
} = process.env;

const sequelize = new Sequelize({
  database: 'postgres',
  password: DB_PASS,
  username: 'postgres',
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,
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
    .then(() => logger.info('Connection has been established successfully'))
    .catch((err) => {
      logger.error('Unable to connect to the database:', err);
    });
};

module.exports = {
  sequelize,
  start,
};
