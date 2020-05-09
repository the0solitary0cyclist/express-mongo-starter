
// to handle reject with a reason and not just throw an error
/* eslint prefer-promise-reject-errors: 0 */ // --> OFF


const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('../config');

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
        return Promise.reject(new Error('Email not found. Please register.'));
        // no, do not add a catch here because if you do it will proceed to .then
        // and then for all bad creds you get TWO error messages
      }
      if (!user.isVerified) {
        return Promise.reject(new Error('Please check your email and verify your account before logging in.'));
      }

      return user.validatePassword(password);
    })
    .then((isValid) => {
      if (!isValid) {
        return Promise.reject(new Error('Incorrect password.'));
      }
      return callback(null, user);
    })
    .catch((err) => callback(err, false));
});

console.log('JWT', JWT_SECRET);
const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256'],
  },
  (payload, done) => {
    done(null, payload.user);
  },
);

module.exports = { localStrategy, jwtStrategy };
