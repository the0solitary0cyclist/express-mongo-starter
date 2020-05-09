// to handle reject with a reason and not just throw an error
/* eslint prefer-promise-reject-errors: 0 */ // --> OFF
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const { User } = require('./models');
const { VerificationToken } = require('../verificationTokens/models');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = express.Router();

const msg = (req, token) => {
  const domain = `http://${req.headers.host}`;
  const subject = 'New Account Created';
  const to = req.body.email; // for now better be an email you own!!
  const from = process.env.FROM_EMAIL; // verified sender identiy
  // const link = `http://${req.headers.host}/welcome`;
  const link = `http://${req.headers.host}/api/verify/${token.user}/${token.token}`;
  const html = `<p>A new account has been created for you on ${domain}. <br>
              Please click on the following <a href="${link}">link</a> 
              to set your password and login.
            </p>`;
  return {
    subject, to, from, html,
  };
};


// Post to register a new user
router.post('/', (req, res) => {
  const { email, password } = req.body;
  return User.find({ email })
  // DeprecationWarning: collection.count is deprecated, and will be removed in a future version.
  // Use Collection.countDocuments or Collection.estimatedDocumentCount instead
    // .count()
    .countDocuments()
    .then((count) => {
      if (count > 0) {
        // There is an existing user with the same email
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Email already registered. Log in?',
          location: 'email',
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then((hash) => User.create({ email, password: hash }))
    .then((user) => VerificationToken.create({ user: user._id }))
    .then((token) => sgMail.send(msg(req, token)))
    .then(() => res.json({ success: true }))
    .catch((err) => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/:id', jwtAuth, (req, res) => User.findById(req.params.id)
  .then((user) => {
    res.json(user.serialize());
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error.',
    });
  }));

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
// router.get('/', (req, res) => User.find()
//   .then((users) => res.json(users.map((user) => user.serialize())))
//   .catch((err) => res.status(500).json({ message: `Internal server error: ${err}` })));

module.exports = { router };
