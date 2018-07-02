const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

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
      const payload = { email: user.email, id: user.id };
      const token = jwt.sign(payload, 'my secret');
      return res.json({ session: token });
    }
    res.status(400).json({ error: info.message });
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  passport.authenticate('user-login', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const payload = { email: user.email, id: user.id };
      const token = jwt.sign(payload, 'my secret');
      return res.json({ session: token });
    }
    res.status(400).json({ error: info.message });
  })(req, res, next);
});
