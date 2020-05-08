// to handle reject with a reason and not just throw an error
/* eslint prefer-promise-reject-errors: 0 */ // --> OFF

const express = require('express');
const passport = require('passport');
const { User } = require('./models');

const router = express.Router();


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
    .then((user) => res.status(201).json(user.serialize()))
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

router.get('/:id', jwtAuth, (req, res) => {
  return User.findById(req.params.id)
    .then((user) => {
      res.json(user.serialize());
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: 'Internal server error.',
      });
    });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => User.find()
  .then((users) => res.json(users.map((user) => user.serialize())))
  .catch((err) => res.status(500).json({ message: `Internal server error: ${err}` })));

module.exports = { router };
