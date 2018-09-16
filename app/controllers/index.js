const express = require('express');

const router = express.Router();

let data;

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res) => {
  res.json({
    status: 'success',
  });
});

router.post('/data', (req, res) => {
  ({
    data,
  } = req.body);
  if (!data) {
    res.status(400).end();
  } else {
    res.json({
      data,
    });
  }
});

router.get('/data', (req, res) => {
  if (data) {
    res.json(data);
  } else {
    res.status(400).end();
  }
});
