/* eslint no-underscore-dangle: 0 */ // --> OFF // account for serializing _id

const mongoose = require('mongoose');

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
});

UserSchema.methods.serialize = () => ({
  email: this.email || '',
  id: this._id,
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
