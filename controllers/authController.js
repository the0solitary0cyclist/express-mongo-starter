// see https://github.com/JeffWilkey/express-boilerplate/blob/9b2a5fceb77f5982d2a17717badc50d5637edf28/controllers/authController.js
const jwt = require('jsonwebtoken');
const config = require('../config');
// not having a config comes up in the error box

const createAuthToken = function(user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.email,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256',
  });
};

const login = (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({ success: true, authToken, ...req.user.serialize() });
}

const refreshToken = (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({
    authToken
  });
}

module.exports = { createAuthToken, login, refreshToken };