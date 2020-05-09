/* eslint no-underscore-dangle: 0 */ // --> OFF // account for serializing _id

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: 'false',
  },
});

UserSchema.methods.serialize = function() {
  return {
    email: this.email,
    id: this._id,
  };
};

UserSchema.methods.validatePassword = function(password) {
  // it can't be an arrow fx because that gives you the wrong 'this'
  // in which case the user's db password is undefined and bycrpt gives you an Illegal error
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) { return bcrypt.hash(password, 10); };

const User = mongoose.model('User', UserSchema);

module.exports = { User };
