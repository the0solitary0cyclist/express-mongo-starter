
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { createAuthToken } = require('../controllers/authController')

const { expect } = chai;

chai.use(chaiHttp);
const { app, runServer, closeServer } = require('../server');
const { User } = require('../users/models');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

describe('Protected Profile', function() {
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
    return User.hashPassword(password).then((password) => {
      return User.create({ email, password }).then((user) => {
        createdUser = user
      })
    });
  });
  afterEach(function() {
    return User.deleteMany({})
  });

  describe.only('api/users/:id', function() {
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
    
    it('should send protected data with a valid token', function () {
      const token = createAuthToken(createdUser)

      return chai
        .request(app)
        .get(`/api/users/${createdUser._id}`)
        .set('authorization', `bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
        });
    });
  });
});
