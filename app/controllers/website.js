const express = require('express');
const passport = require('passport');
const validator = require('validator');
const logger = require('../../config/winston');

const router = express.Router();
const {
  WebsiteModel,
} = require('../models/index');

module.exports = (app) => {
  app.use('/website', router);
};

router.use((req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).send({
        error: info.message,
      });
    }
    next();
  })(req, res, next);
});

router.get('/', async (req, res, next) => {
  let websites;
  try {
    websites = await WebsiteModel.findAll({
      where: {},
      order: [
        ['id', 'DESC'],
      ],
      limit: 1,
    });
  } catch (e) {
    return next(e);
  }
  res.json(websites);
});

router.delete('/:id', async (req, res, next) => {
  const {
    id,
  } = req.params;
  if (isNaN(+id)) {
    return res.status(400).send({
      error: 'invalid param value',
    });
  }
  try {
    await WebsiteModel.destroy({
      where: {
        id,
      },
    });
  } catch (err) {
    return next(err);
  }
  res.status(200).send(true);
});

router.get('/:start', async (req, res, next) => {
  const {
    start,
  } = req.params;
  if (isNaN(+start)) {
    return res.status(400).send({
      error: 'invalid param value',
    });
  }
  let websites;
  try {
    websites = await WebsiteModel.findAll({
      where: {},
      offset: start,
      limit: 12,
    });
  } catch (e) {
    return next(e);
  }
  res.json(websites);
});


router.post('/', async (req, res, next) => {
  const {
    name,
    url,
  } = req.body;
  if (!name || !url) {
    return res.status(400).send({
      error: 'Invalid name and url',
    });
  }
  if (!validator.isURL(url)) {
    return res.status(400).send({
      error: 'Invlaid url',
    });
  }
  let website;

  try {
    website = await WebsiteModel.findOne({
      where: {
        name,
      },
    });
  } catch (e) {
    return next(e);
  }

  if (website) {
    return res.status(400).send({
      error: 'a website with this name already exists',
    });
  }

  try {
    website = await WebsiteModel.findOne({
      where: {
        url,
      },
    });
  } catch (e) {
    return next(e);
  }

  if (website) {
    return res.status(400).send({
      error: 'a website with this name already exists',
    });
  }

  try {
    website = await WebsiteModel.build({
      name,
      url,
      status: 'online',
    });
    website = await website.save();
    logger.info('website saved');
  } catch (e) {
    return next('unable to save website to the database');
  }
  res.json(website);
});
