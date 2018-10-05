const nock = require('nock');
const request = require('supertest');
const {
  expect,
} = require('chai');

const {
  app,
} = require('../../app');
const {
  WebsiteModel,
  UserModel,
} = require('../../app/models/index');
require('../../app/workers/uptime');

describe('Uptime', () => {
  let session;
  let websites;
  before((done) => {
    request(app)
      .post('/user/signup')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
        phone: '+2349036510690',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        ({
          session,
        } = res.body);
        return done();
      });
  });

  before((done) => {
    request(app)
      .post('/website')
      .send({
        name: 'easy',
        url: 'http://google.com',
      })
      .set({
        Authorization: `Bearer ${session}`,
      })
      .type('form')
      .expect(200, done);
  });
  before((done) => {
    WebsiteModel.findAll({
      where: {},
    }).then((sites) => {
      websites = sites;
      done();
    }).catch(err => done(err));
  });
  after((done) => {
    WebsiteModel.destroy({
      where: {},
    })
      .then(() => {
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  after((done) => {
    UserModel.destroy({
      where: {},
    })
      .then(() => {
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  describe('change website status', () => {
    beforeEach(() => {
      websites.forEach((website) => {
        nock(website.url)
          .get('/')
          .reply(400, {
            status: 'offline',
          });
      });
    });
    beforeEach((done) => {
      setTimeout(() => done(), 60000);
    });
    it('should change status to offline', (done) => {
      WebsiteModel.findAll({
        where: {},
      }).then(((websites) => {
        websites.forEach((website) => {
          expect(website.status).to.equal('offline');
        });
        done();
      })).catch(err => done(err));
    });
  });

  describe('change website status', () => {
    beforeEach(() => {
      websites.forEach((website) => {
        nock(website.url)
          .get('/')
          .reply(200, {
            status: 'online',
          });
      });
    });
    beforeEach((done) => {
      setTimeout(() => done(), 60000);
    });
    it('should change status to online', (done) => {
      WebsiteModel.findAll({
        where: {},
      }).then(((websites) => {
        websites.forEach((website) => {
          expect(website.status).to.equal('online');
        });
        done();
      })).catch(err => done(err));
    });
  });
});
