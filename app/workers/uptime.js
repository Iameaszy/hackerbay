const request = require('request');
const cron = require('node-cron');

const {
  WebsiteModel,
  UserModel,
} = require('../models/index');
const logger = require('../../config/winston');
const twilio = require('./twilio');


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
  websites.forEach((website) => {
    const {
      status,
    } = website;
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
      if (status !== website.status) {
        UserModel.findOne({
          where: {
            id: website.userid,
          },
        }).then((user) => {
          twilio.send(`Your website ${website.url} is currently down, please check!`, user.phone);
          logger.info(`user with email ${user.email} notified about its website ${website.url}`);
        }).catch((err) => {
          logger.error(`${new Date()} trello: ${err}`);
        });
      }
      website.save().then(() => logger.info(`website ${website.name} updated`))
        .catch(err => logger.error(`unable to update website ${website.name}`, err));
    });
  });
});
