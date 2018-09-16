const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


if (cluster.isMaster) {
  console.log(`master worker ${process.pid} is started`);
  const worker = cluster.fork();

  require('./app');
} else {
  setTimeout(() => {
    require('./app/workers/uptime.js');
    console.log(`worker ${process.pid} is started`);
  }, 5000);
}
