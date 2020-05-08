
const express = require('express');
const passport = require('passport');
const { User } = require('../users/models');
const { createAuthToken } = require('../controllers/authController')

// eventually move logic out of the routes and into the authController

const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(422).send({ success: false, message: err.message });
    }
    const authToken = createAuthToken(user.serialize());
    res.json({ success: true, authToken, user: user.serialize() });
  })(req, res, next);
});

module.exports = { router };
