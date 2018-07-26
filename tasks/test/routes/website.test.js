const request = require('supertest');
const chai = require('chai');
const { WebsiteModel: Website } = require('../../app/models/website');
const { UserModel } = require('../../app/models/user');
const { app } = require('../../app');

const { expect } = chai;
describe('/website', () => {
  let session;
  before((done) => {
    request(app)
      .post('/user/signup')
      .type('form')
      .send({ email: 'easyclick05@gmail.com', password: 'abcdefgh' })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        ({ session } = res.body);
        done();
      });
  });
  describe('GET /website', () => {
    before((done) => {
      UserModel.destroy({ where: {} })
        .then(() => done())
        .catch(e => done(e));
    });

    beforeEach((done) => {
      Website.destroy({
        where: {},
      })
        .then(() => {
          done();
        })
        .catch((e) => {
          done(e);
        });
    });

    it('should return 200 status code', (done) => {
      request(app)
        .get('/website')
        .set({ Authorization: session })
        .expect(200, done);
    });

    it('should return array of data', (done) => {
      request(app)
        .get('/website')
        .set({ Authorization: session })
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an('array');
          done();
        });
    });
    it('should return empty array', (done) => {
      request(app)
        .get('/website')
        .set({ Authorization: session })
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.length).to.equals(0);
          done();
        });
    });
    /*
  it('should return empty array with one element', (done) => {
    before((done)=>{

    })
    request(app)
      .get('/website')
      .set({ Authorization: session })
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.length).to.equals(0);
        done();
      });
  });
  */
  });

  describe('POST /website', () => {
    it('should return 200 status code', (done) => {
      request(app)
        .post('/website')
        .send({ name: 'easy', url: 'easy.com' })
        .set({ Authorization: session })
        .type('form')
        .expect(200, done);
    });
  });
});
