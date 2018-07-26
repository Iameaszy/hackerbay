const express = require('express');
const config = require('./config/db/config');

const app = express();
require('dotenv').config();
require('./config/express')(app, config);

const server = app.listen(config.port, () => {
  console.log(`Express server listening on port ${config.port}`);
});

module.exports = {
  server,
  app,
};
