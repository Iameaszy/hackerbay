const request = require('supertest');
const chai = require('chai');
const { UserModel, WebsiteModel } = require('../../app/models/index');
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
  describe('GET /method should return array', () => {
    before((done) => {
      request(app)
        .post('/website')
        .send({
          name: 'easy',
          url: 'http://easy.com',
        })
        .set({
          Authorization: `Bearer ${session}`,
        })
        .type('form')
        .expect(200, done);
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
    it('with length 1', (done) => {
      request(app)
        .get('/website')
        .set({
          Authorization: `Bearer ${session}`,
        })
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.length).to.equals(1);
          done();
        });
    });
  });
  describe('GET /website', () => {
    beforeEach((done) => {
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

    it('should return 200 status code', (done) => {
      request(app)
        .get('/website')
        .set({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session}`,
        })
        .expect(200, done);
    });

    it('should return 401 status code', (done) => {
      request(app)
        .get('/website')
        .expect(401, done);
    });

    it('should return array of data', (done) => {
      request(app)
        .get('/website')
        .set({
          Authorization: `Bearer ${session}`,
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          expect(res.body).to.be.an('array');
          done();
        });
    });
    it('should return empty array', (done) => {
      request(app)
        .get('/website')
        .set({
          Authorization: `Bearer ${session}`,
        })
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.length).to.equals(0);
          done();
        });
    });
  });
  describe('DELETE /website/:id', () => {
    let id;
    beforeEach((done) => {
      request(app)
        .post('/website')
        .send({
          name: 'easy',
          url: 'http://easy.com',
        })
        .set({
          Authorization: `Bearer ${session}`,
        })
        .type('form')
        .end((err, res) => {
          if (err) return done(err);
          ({ id } = res.body);
          done();
        });
    });
    afterEach((done) => {
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

    it('should return 200 status code', (done) => {
      request(app)
        .delete(`/website/${id}`)
        .set({
          Authorization: `Bearer ${session}`,
        })
        .expect(200, done);
    });
    it('should return true as a response text', (done) => {
      request(app)
        .delete(`/website/${id}`)
        .set({
          Authorization: `Bearer ${session}`,
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.true;
          done();
        });
    });
    it('should error', (done) => {
      request(app)
        .delete('/website/id')
        .set({
          Authorization: `Bearer ${session}`,
        })
        .expect(400, done);
    });
  });
  describe('GET /website/:start', () => {
    beforeEach((done) => {
      request(app)
        .post('/website')
        .send({
          name: 'easy',
          url: 'http://easy.com',
        })
        .set({
          Authorization: `Bearer ${session}`,
        })
        .type('form')
        .expect(200, done);
    });
    afterEach((done) => {
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

    it('should return 200 status code', (done) => {
      request(app)
        .get('/website/0')
        .set({
          Authorization: `Bearer ${session}`,
        })
        .expect(200, done);
    });
    it('should return array of websites', (done) => {
      request(app)
        .get('/website/0')
        .set({
          Authorization: `Bearer ${session}`,
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.an('array').with.length(1);
          done();
        });
    });
    it('should error with 400 status code', (done) => {
      request(app)
        .get('/website/id')
        .set({
          Authorization: `Bearer ${session}`,
        })
        .expect(400, done);
    });
  });
  describe('POST /website', () => {
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

    it('should return 401 status code', (done) => {
      request(app)
        .post('/website')
        .send({
          name: 'easy',
          url: 'http://easy.com',
        })
        .type('form')
        .expect(401, done);
    });

    it('should return 200 status code', (done) => {
      request(app)
        .post('/website')
        .send({ name: 'easy', url: 'http://easy.com' })
        .set({
          Authorization: `Bearer ${session}`,
        })
        .type('form')
        .expect(200, done);
    });

    it('should return 400 status code', (done) => {
      request(app)
        .post('/website')
        .send({
          name: 'easy',
          url: 'http://easy.com',
        })
        .set({
          Authorization: `Bearer ${session}`,
        })
        .type('form')
        .expect(400, done);
    });

    it('should return 401 status code', (done) => {
      request(app)
        .post('/website')
        .send({
          name: 'easy',
          url: 'http://easy.com',
        })
        .type('form')
        .expect(401, done);
    });

    it('should return 400 status code with invalid url as error message', (done) => {
      request(app)
        .post('/website')
        .send({ name: 'easy', url: 'easy.com' })
        .set({
          Authorization: `Bearer ${session}`,
        })
        .type('form')
        .expect(400, done);
    });

    it('should return 400 status code', (done) => {
      request(app)
        .post('/website')
        .set({
          Authorization: `Bearer ${session}`,
        })
        .type('form')
        .expect(400, done);
    });
  });
});
