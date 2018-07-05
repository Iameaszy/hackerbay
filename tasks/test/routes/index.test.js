const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('./../../app');

const { expect } = chai;
chai.use(chaiHttp);

after(() => {
  app.server.close();
});

describe('get /', () => {
  it('should have 200 response status', async () => {
    let res;
    try {
      res = await chai.request(app.app).get('/');
    } catch (e) {
      expect(e).to.be.null;
    }
    expect(res.status).to.equal(200);
  });
  it('should reply with a valid data', async () => {
    let res;
    try {
      res = await chai.request(app.app).get('/');
    } catch (e) {
      expect(e).to.be.null;
    }

    expect(res.body).to.be.an('object');
    expect(res.body)
      .to.have.property('status')
      .eql('success');
  });
});
describe('post /data', () => {
  it('should have 200 response status', async () => {
    let res;
    try {
      res = await chai
        .request(app.app)
        .post('/data')
        .type('form')
        .send({ data: 'Any string' });
    } catch (e) {
      expect(e).to.be.null;
    }
    expect(res.status).to.equal(200);
  });
  it('should reply with a valid data', async () => {
    let res;
    try {
      res = await chai
        .request(app.app)
        .post('/data')
        .type('form')
        .send({ data: 'Any string' });
    } catch (e) {
      expect(e).to.be.null;
    }

    expect(res.body).to.be.an('object');
    expect(res.body)
      .to.have.property('data')
      .to.be.a('string');
  });

  describe('post /data with invalid data', () => {
    it('should reply with send code 400 for invalid data', async () => {
      let res;
      try {
        res = await chai
          .request(app.app)
          .post('/data')
          .type('form');
      } catch (e) {
        expect(e).to.be.null;
      }

      expect(res.status).to.equals(400);
    });
  });
});

describe('get /data', () => {
  it('should reply with 200 status code', async function dataValid() {
    let res;
    try {
      res = await chai.request(app.app).get('/data');
    } catch (e) {
      throw e;
    }

    if (res && res.body && res.body.data) {
      expect(res.status).to.equals(200);
    } else {
      this.skip();
    }
  });
  it('should reply with 400 status code', async function dataInvalid() {
    let res;
    try {
      res = await chai.request(app.app).get('/data');
    } catch (e) {
      throw e;
    }

    if (!(res && res.body && res.body.data)) {
      expect(res.status).to.equals(400);
    } else {
      this.skip();
    }
  });
});