
const express = require('express');
const passport = require('passport');
const authController = require('./controllers');
// eventually move logic out of the routes and into the authController

const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(422).send({ success: false, message: err.message });
    }
    req.user = user; // not ideal
    return authController.login(req, res);
  })(req, res, next);
});

const jwtAuth = passport.authenticate('jwt', { session: false });
// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, authController.refreshToken);

module.exports = { router };
