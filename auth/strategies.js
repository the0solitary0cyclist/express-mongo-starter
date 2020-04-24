
// to handle reject with a reason and not just throw an error
/* eslint prefer-promise-reject-errors: 0 */ // --> OFF

const { Strategy: LocalStrategy } = require('passport-local');

const { User } = require('../users/models');

const localStrategy = new LocalStrategy({
  usernameField: 'email', // overwrite "username" default
  passwordField: 'password',
}, (email, password, callback) => {
  let user;
  User.findOne({ email })
    .then((_user) => {
      user = _user;
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect email or password',
        });
      }
      return user;
    })
    .then((validUser) => callback(null, validUser))
    .catch((err) => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

module.exports = { localStrategy };
