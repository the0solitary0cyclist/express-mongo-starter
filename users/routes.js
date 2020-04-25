
// to handle reject with a reason and not just throw an error
/* eslint prefer-promise-reject-errors: 0 */ // --> OFF

const express = require('express');

const { User } = require('./models');

const router = express.Router();


// Post to register a new user
router.post('/', (req, res) => {
  const requiredFields = ['email', 'password'];
  const missingField = requiredFields.find((field) => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField,
    });
  }

  const stringFields = ['email', 'password'];
  const nonStringField = stringFields.find(
    (field) => field in req.body && typeof req.body[field] !== 'string',
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField,
    });
  }

  // If the email and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['email', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    (field) => req.body[field].trim() !== req.body[field],
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField,
    });
  }

  const sizedFields = {
    email: {
      min: 1,
    },
    password: {
      min: 6,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72,
    },
  };
  const tooSmallField = Object.keys(sizedFields).find(
    (field) => 'min' in sizedFields[field]
            && req.body[field].trim().length < sizedFields[field].min,
  );
  const tooLargeField = Object.keys(sizedFields).find(
    (field) => 'max' in sizedFields[field]
            && req.body[field].trim().length > sizedFields[field].max,
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField,
    });
  }

  const { email, password } = req.body;
  return User.find({ email })
    .count()
    .then((count) => {
      if (count > 0) {
        // There is an existing user with the same email
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Email already taken',
          location: 'email',
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then((hash) => User.create({
      email,
      password: hash,
    }))
    .then((user) => res.status(201).json(user.serialize()))
    .catch((err) => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      return res.status(500).json({ code: 500, message: 'Internal server error' });
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
