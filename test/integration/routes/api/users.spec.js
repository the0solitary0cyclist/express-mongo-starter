
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { createAuthToken } = require('../../../../auth/controllers');

const { expect } = chai;

chai.use(chaiHttp);
const { app, runServer, closeServer } = require('../../../../server');
const { User } = require('../../../../users/models');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../../../../config');

describe('Users', function() {
  const email = 'test@email.com';
  const password = 'TestPW#123';
  let createdUser;

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then((password) => User.create({ email, password }).then((user) => {
      createdUser = user;
    }));
  });
  afterEach(function() {
    return User.deleteMany({});
  });

  describe('/api/users', function() {
    const validEmail = 'newUser@email.com';
    const validPassword = 'Hello#123å';

    it('should create a new user with registration details', function() {
      return chai.request(app)
        .post('/api/users')
        .send({
          email: validEmail,
          password: validPassword,
          confirmPassword: validPassword,
        })
        .then((res) => {
          expect(res.status).to.eql(201);
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('id');
          expect(res.body).not.to.have.property('_id');
          expect(res.body).not.to.have.property('password');
        });
    });

    it('should not create a new user for an existing email', function() {
      return chai.request(app)
        .post('/api/users')
        .send({
          email: createdUser.email,
          password,
          confirmPassword: password,
        })
        .then((res) => {
          expect(res.status).to.eql(422);
          console.log(res.error); // text: '{"code":422,"reason":"ValidationError","message":"Email already registered. Log in?","location":"email"}',
        });
    });

    xit('should not create a new user when passwords do not match', function() {
      return chai.request(app)
        .post('/api/users')
        .send({
          email: validEmail,
          password: validPassword,
          confirmPassword: 'notTheValidPassword',
        })
        .then((res) => {
          expect(res.status).to.eql(201);
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('id');
          expect(res.body).not.to.have.property('_id');
          expect(res.body).not.to.have.property('password');
        });
    });

    xit('should not create a new user when email is missing', function() {
      return chai.request(app)
        .post('/api/users')
        .send({
          email: 'validEmail',
          password: validPassword,
          confirmPassword: validPassword,
        })
        .then((res) => {
          expect(res.status).to.eql(201);
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('id');
          expect(res.body).not.to.have.property('_id');
          expect(res.body).not.to.have.property('password');
        });
    });
  });

  describe('api/users/:id', function() {
    it('should reject requests with no credentials', function() {
      return chai.request(app)
        .get(`/api/users/${createdUser._id}`)
        .then((res) => {
          expect(res).to.have.status(401);
        });
    });

    it('should reject requests with an invalid token', function() {
      const token = jwt.sign(
        {
          email,
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d',
        },
      );

      return chai.request(app)
        .get(`/api/users/${createdUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(401);
        });
    });

    it('should reject requests with an expired token', function() {
      const token = jwt.sign(
        {
          user: {
            email,
          },
          exp: Math.floor(Date.now() / 1000) - 10, // Expired ten seconds ago
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: email,
        },
      );

      return chai.request(app)
        .get(`/api/users/${createdUser._id}`)
        .set('authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(401);
        });
    });

    it('should send protected data with a valid token', function() {
      const token = createAuthToken(createdUser);

      return chai
        .request(app)
        .get(`/api/users/${createdUser._id}`)
        .set('authorization', `bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
        });
    });
  });
});
