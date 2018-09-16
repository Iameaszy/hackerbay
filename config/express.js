const express = require('express');
const glob = require('glob');

const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const cors = require('cors');
const passport = require('passport');
const flash = require('express-flash');
const dotenv = require('dotenv');
const session = require('express-session');
const psql = require('./db/psql');
const logger = require('./winston');


module.exports = (app, config) => {
  // dotenv configuration
  dotenv.config();
  // postgresql  configuration
  psql.start();
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';
  app.engine(
    'handlebars',
    exphbs({
      layoutsDir: `${config.root}/app/views/layouts/`,
      defaultLayout: 'main',
      partialsDir: [`${config.root}/app/views/partials/`],
    }),
  );
  app.set('views', `${config.root}/app/views`);
  app.set('view engine', 'handlebars');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(`${config.root}/public`));
  app.use(methodOverride());
  app.use(
    cors({
      origin: 'http://localhost:3001',
    }),
  );
  app.use(
    session({
      secret: 'secret',
      saveUninitialized: false,
      resave: true,
    }),
  );
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  const passports = glob.sync(`${__dirname}/passport/*.js`);
  passports.forEach((passport) => {
    require(passport);
  });
  const controllers = glob.sync(`${config.root}/app/controllers/*.js`);
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      logger.error(err);
      res.send({
        error: 'Server error',
      });
    });
  }
  return app;
};
