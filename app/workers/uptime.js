const request = require('request');
const cron = require('node-cron');
const dotEnv = require('dotenv');

dotEnv.config();
const {
  WebsiteModel,
} = require('../models/index');
const logger = require('../../config/winston');


module.exports = cron.schedule('* * * * *', async () => {
  let websites;
  try {
    websites = await WebsiteModel.findAll({
      where: {},
    });
  } catch (e) {
    logger.info('.............................');
    return logger.error(e);
  }
  logger.info('.............................');
  console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
  websites.forEach((website) => {
    request.get({
      url: website.url,
      method: 'GET',
      timeout: 10000,
    }, (err, res) => {
      if (err) {
        return logger.error(err.code);
      }
      if (res.statusCode !== 200) {
        website.status = 'offline';
      } else {
        website.status = 'online';
      }
      website.save().then(() => logger.info(`website ${website.name} updated`))
        .catch(err => logger.error(`unable to update website ${website.name}`, err));
    });
  });
});
