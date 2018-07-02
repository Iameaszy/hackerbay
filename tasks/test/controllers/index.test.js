const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('./../../app');

const { expect } = chai;
chai.use(chaiHttp);
const request = chai.request(app.app);

describe('get /', () => {
  let req;
  beforeEach(() => {
    req = request.get('/');
  });
  after(() => {
    app.server.close();
  });
  it('should have 200 response status', (done) => {
    req.end((err, res) => {
      expect(res.status).to.equals(200);
      expect(res.body).to.be.an('object');
      expect(res.body)
        .to.have.property('status')
        .eql('success');
      done();
    });
  });
});
