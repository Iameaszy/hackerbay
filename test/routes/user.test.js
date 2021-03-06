const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const {
  UserModel,
} = require('../../app/models/index');
const {
  sequelize,
} = require('../../config/db/psql');

const {
  expect,
} = chai;
chai.use(chaiHttp);

after(() => {
  app.server.close();
  sequelize.close();
});
beforeEach((done) => {
  setTimeout(() => done(), 500);
});

describe('/user/signup', () => {
  before((done) => {
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

  it('should reply with 200 status code', (done) => {
    chai
      .request(app.app)
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
        expect(res.status).to.equals(200);
        expect(res.body.session).to.be.a('string');
        done();
      });
  });

  it('should reply with 400 status code', (done) => {
    chai
      .request(app.app)
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
        expect(res.status).to.equals(400);
        expect(res.body)
          .to.have.property('error')
          .to.equal('User already exists');
        done();
      });
  });
});

describe('/user/signup with invalid data', () => {
  beforeEach((done) => {
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

  it('should reply with invalid email error message', (done) => {
    chai
      .request(app.app)
      .post('/user/signup')
      .type('form')
      .send({
        email: 'easyclick@gmail',
        password: '62337087',
        phone: '+2349036510690',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('error')
          .to.equals('Invalid email');
        expect(res.status).to.equals(400);
        done();
      });
  });
  it('should reply with 400 status code', (done) => {
    chai
      .request(app.app)
      .post('/user/signup')
      .type('form')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equals(400);
        done();
      });
  });
  it('should reply with Missing credentials error message', (done) => {
    chai
      .request(app.app)
      .post('/user/signup')
      .type('form')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('error')
          .to.equals('Missing credentials');
        done();
      });
  });
});

describe('/user/login', () => {
  before((done) => {
    chai
      .request(app.app)
      .post('/user/signup')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
        phone: '+2349036510690',
      })
      .then(() => done())
      .catch((err) => {
        done(err);
      });
  });
  after((done) => {
    UserModel.destroy({
      where: {},
    })
      .then((data) => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should reply with 200 status code', (done) => {
    chai
      .request(app.app)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equals(200);
        done();
      });
  });

  it('should have a response body with property session', (done) => {
    chai
      .request(app.app)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('session')
          .to.be.a('string');
        done();
      });
  });
  it('should have a response status code of 200', (done) => {
    chai
      .request(app.app)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should have a response status code of 400', (done) => {
    chai
      .request(app.app)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick0@gmail.com',
        password: 'abcdefgh',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('should have an error response "User does not exist"', (done) => {
    chai
      .request(app.app)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick0@gmail.com',
        password: 'abcdefgh',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('error')
          .to.equals('User does not exist');
        done();
      });
  });
  it('should have an error response "Invalid password"', (done) => {
    chai
      .request(app.app)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcde',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('error')
          .to.equals('Invalid Password');
        done();
      });
  });
  it('should have an error response "Missing credentials"', (done) => {
    chai
      .request(app.app)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('error')
          .to.equals('Missing credentials');
        done();
      });
  });
});
