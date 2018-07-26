const express = require('express');
const jwt = require('jsonwebtoken');

const { SECRET } = process.env;
const router = express.Router();
const { WebsiteModel } = require('../models/website');
const { UserModel } = require('../models/user');

module.exports = (app) => {
  app.use('/website', router);
};
router.use((req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorised Access');
  }
  req.token = req.headers.authorization;
  next();
});
router.get('/', async (req, res, next) => {
  let websites;
  try {
    websites = await WebsiteModel.find({ where: {} });
  } catch (e) {
    next(e);
    return console.log(e);
  }

  res.json(websites || []);
});

router.post('/', async (req, res, next) => {
  const { name, url } = req.body;
  if (!name || !url) {
    return res.status(400).end('Invlaid name and url');
  }
  let user;
  try {
    user = jwt.verify(req.token, SECRET);
  } catch (e) {
    return console.log(e);
  }
  let website;

  try {
    website = await WebsiteModel.findOne({ where: { name } });
  } catch (e) {
    next(e);
    return console.log(e);
  }

  if (website) {
    return res.status(400).send('a website with this name already exists');
  }

  try {
    website = await WebsiteModel.findOne({ where: { url } });
  } catch (e) {
    next(e);
    return console.log(e);
  }

  if (website) {
    return res.status(400).send('a website with this name already exists');
  }

  try {
    website = await WebsiteModel.create({
      name,
      url,
      status: 'online',
    });
  } catch (e) {
    next('unable to save website to the database');
    return console.log(e);
  }
  console.log('webiste:', website);
  res.json(website);
});
