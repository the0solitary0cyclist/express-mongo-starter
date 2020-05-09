
const mongoose = require('mongoose');
uuid = require('uuid');
// see https://github.com/rubocoptero/telemenu/blob/e7726abbc9708659f8da68687ce7f26e232218b4/test/server/unit/app/db/verification-token.js

const VerificationTokenSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    unique: true,
    required: true,
    default: uuid.v4,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: '24h',
    // expires: '5m'
    // "expires": If set, Mongoose creates a TTL index on this path.
    // TTL (time-to-live) indexes are special single-field indexes that MongoDB can use to automatically remove documents
    // from a collection after a certain amount of time or at a specific clock time.
    // https://docs.mongodb.com/manual/core/index-ttl/
  },
});

// verificationTokenSchema.statics.populatedFindByToken = function(token, cb) {
//   this.findOne({ token : token })
//       .populate('user')
//       .exec(cb);
// };

// verificationTokenSchema.statics.getUserByToken = function(token, cb) {
//   this.populatedFindByToken(token, function(err, resultToken) {
//       if (err) return cb(err);
//       if (resultToken) return cb(err, resultToken.user);
//       cb(err, resultToken);
//   });
// };

// verificationTokenSchema.statics.createFor = function(user, cb) {
//   const verificationToken = new verificationToken({user: user._id});
//   verificationToken.save(function(err, savedToken) {
//       if (err) return cb(err);
//       mailer.sendVerificationLink(user.email, savedToken.link,
//           function(err) {
//               if (err) return cb(err);
//               //console.log('Verification link sent to ' + user.email + ' successfully');
//               cb(err, savedToken);
//           });
//   });
// };

// VerificationTokenSchema.statics.createVerificationToken = function(user) {
//   const verificationToken = new verificationToken({user: user._id});
//   console.log(verificationToken)
//   verificationToken.save();
// }

// verificationTokenSchema.virtual('link').get(function() {
//   return process.env.URL_PROTOCOL_HOST + '/verificacion/' + this.token;
// });


const VerificationToken = mongoose.model('VerificationToken', VerificationTokenSchema);

module.exports = { VerificationToken };
