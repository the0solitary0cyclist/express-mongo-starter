const { VerificationToken } = require('./models');
const { User } = require('../users/models');

const verifyToken = (req, res) => {
  VerificationToken.findOne({ user: req.params.userId, token: req.params.token })
    .then((validToken) => {
      if (!validToken) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Unable to verify your account. Send email again or register.',
          location: 'email',
        });
      }

      return User.findByIdAndUpdate({ _id: validToken.user }, { isVerified: 'true' })
        .then(() => res.redirect('/'))
        .catch((err) => console.log(err));
    });
};

module.exports = { verifyToken };
