
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken')
const config = require('../config');
const { User } = require('../users/models');
// not having a config comes up in the error box

const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.email,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(422).send({ success: false, message: err.message });
    }
    const authToken = createAuthToken(user.serialize());
    res.json({success: true, authToken});
  })(req, res, next);
});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/currentUser', jwtAuth, (req, res) => {
  console.log(req.user)
  User.findById(req.user.id)
  .then(user => {
    res.json(user.serialize());
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({
        message: 'Internal server error.'
    });
  });
})

module.exports = { router };
