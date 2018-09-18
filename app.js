const express = require('express');
const config = require('./config/db/config');
const logger = require('./config/winston');

const app = express();
require('dotenv').config();
require('./config/express')(app, config);

const server = app.listen(config.port, () => {
  logger.info(`Express server listening on port ${config.port}`);
});


module.exports = {
  server,
  app,
};
