
const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(422).send({ success: false, message: err.message });
    }
    return res.send({ success: true, user, message: 'authenticated' }); // this user is not serialized
  })(req, res, next);
});

module.exports = { router };
