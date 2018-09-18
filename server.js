const cluster = require('cluster');
const logger = require('./config/winston');
const uptime = require('./app/workers/uptime.js');


if (cluster.isMaster) {
  logger.info(`master worker ${process.pid} is started`);
  cluster.fork();

  require('./app');
} else {
  setTimeout(() => {
    uptime();
    logger.info(`worker ${process.pid} is started`);
  }, 5000);
}
