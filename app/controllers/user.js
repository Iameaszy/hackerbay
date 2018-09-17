const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const {
  SECRET,
} = process.env;
const router = express.Router();

module.exports = (app) => {
  app.use('/user', router);
};

router.post('/signup', (req, res, next) => {
  passport.authenticate('user-register', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const payload = {
        email: user.email,
        id: user.id,
      };
      const token = jwt.sign(payload, SECRET);
      res.json({
        session: token,
      });
    } else {
      res.status(400).send({
        error: info.message,
      });
    }
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  passport.authenticate('user-login', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const payload = {
        email: user.email,
        id: user.id,
      };
      const token = jwt.sign(payload, SECRET);
      res.json({
        session: token,
      });
    } else {
      res.status(400).send({
        error: info.message,
      });
    }
  })(req, res, next);
});
