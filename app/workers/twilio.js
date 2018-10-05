// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console

require('dotenv').load({
  path: `${__dirname}/../../.env`,
});

const {
  ACCT_SID: accountSid,
  AUTH_TOKEN: authToken,
} = process.env;
const client = require('twilio')(accountSid, authToken);
const logger = require('../../config/winston');

module.exports = {
  send: (msg, number) => {
    client.messages
      .create({
        body: msg,
        from: '+16672221678',
        to: number,
      })
      .then(message => logger.info(message.sid))
      .catch(err => logger.error(err))
      .done();
  },
};