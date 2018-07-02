const express = require('express');
const config = require('./config/db/config');
const glob = require('glob');

const app = express();
require('./config/express')(app, config);

const server = app.listen(config.port, () => {
  console.log(`Express server listening on port ${config.port}`);
});

module.exports = {
  server,
  app,
};
