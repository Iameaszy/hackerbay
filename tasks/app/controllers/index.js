const express = require('express');

const router = express.Router();

let data;
module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res) => {
  res.json({ status: 'success' });
});

router.post('/data', (req, res) => {
  ({ data } = req.body);
  res.json({ data });
});

router.get('/data', (req, res) => {
  res.json(data);
});
