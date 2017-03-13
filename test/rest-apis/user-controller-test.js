process.env.NODE_ENV = 'test';
process.env.PORT = 9000;

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../../app.test');

let User = require('../../schemas/user');

describe('REST Api test: USER', () => {
  after((done) => { //Clear database after tests
    User.remove({}, () => {
      done();
    });
  });

  let TOKEN;

  describe('POST /register', () => {
    it('it should register new user', (done) => {

      const body = {
        "name": "Teste",
        "email": "teste@gmail.com",
        "username": "teste",
        "password": "654321"
      };

      chai.request(app)
          .post('/users/register').send(body)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            done();
          });
    });

    it('it should fail on register new user (missing password)', (done) => {

      const body = {
        "name": "Teste",
        "email": "teste@gmail.com",
        "username": "teste"
      };

      chai.request(app)
          .post('/users/register').send(body)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.be.a('object');
            res.body.should.have.property('msg').eql('failedToRegisterUser');
            done();
          });
    });

    it('it should fail on register new user (missing username)', (done) => {

      const body = {
        "name": "Teste",
        "email": "teste@gmail.com",
        "password": "654321"
      };

      chai.request(app)
          .post('/users/register').send(body)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.be.a('object');
            res.body.should.have.property('msg').eql('failedToRegisterUser');
            done();
          });
    });

    it('it should fail on register new user (missing email)', (done) => {

      const body = {
        "name": "Teste",
        "username": "teste",
        "password": "654321"
      };

      chai.request(app)
          .post('/users/register').send(body)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.be.a('object');
            res.body.should.have.property('msg').eql('failedToRegisterUser');
            done();
          });
    });
  });

  describe('PUT /authenticate', () => {
    it('it should reject the authentication', (done) => {

      const body = {
        "username": "teste",
        "password": "65432"
      };

      chai.request(app)
          .put('/users/authenticate').send(body)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.be.a('object');
            res.body.should.have.property('msg').eql('wrongPassword');
            done();
          });
    });

    it('it should authenticate a user', (done) => {

      const body = {
        "username": "teste",
        "password": "654321"
      };

      chai.request(app)
          .put('/users/authenticate').send(body)
          .end((err, res) => {
            TOKEN = res.body.token;

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            done();
          });
    });
  });

  describe('GET /profile', () => {
    it('should retrieve the current user profile', (done) => {
      chai.request(app)
          .get('/users/profile')
          .set('Authorization', TOKEN)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
          });
    });
  });
});


