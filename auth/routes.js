
const express = require('express');
const passport = require('passport');

const router = express.Router();

const localAuth = passport.authenticate('local', { session: false });
// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
  // console.log(req.body); // comes off of the form
  // { email: 'a@b.com', password: '#123' }
  // console.log(req.user); // from the strategy after db lookup
  // { id: 5ea357c04c568f91dfa5a9e6, email: 'a@b.com', password: '#123' }
  res.json(req.user);
});

module.exports = { router };
