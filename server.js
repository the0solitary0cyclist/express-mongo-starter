/* eslint consistent-return: 0 */ // --> OFF // to allow for reused server variable

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const { PORT, DATABASE_URL } = require('./config');

const app = express();

// puts form data on req.body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { localStrategy, jwtStrategy } = require('./auth/strategies');

passport.use(localStrategy, jwtStrategy);
const { router: authRouter } = require('./auth/routes');
const { router: usersRouter } = require('./users/routes');
const { router: verificationTokensRouter } = require('./verificationTokens/routes');

const mongooseOptions = { // fight deprecations
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

// CORS
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
//   if (req.method === 'OPTIONS') {
//     return res.send(204);
//   }
//   return next();
// });

app.use(express.static('public'));

// Authentication
passport.use(localStrategy);
passport.use(jwtStrategy);


app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/verify', verificationTokensRouter);

app.use('*', (req, res) => res.status(404).json({ message: 'Not Found' }));

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

const runServer = (databaseUrl, port = PORT) => new Promise((resolve, reject) => {
  mongoose.connect(databaseUrl, mongooseOptions, (err) => {
    if (err) {
      return reject(err);
    }

    server = app.listen(port, () => {
      process.stdout.write(`Your app is listening on port ${port}`);
      return resolve();
    })
      .on('error', (mongooseError) => {
        mongoose.disconnect();
        return reject(mongooseError);
      });
  });
});

const closeServer = () => mongoose.disconnect().then(() => new Promise((resolve, reject) => {
  process.stdout.write('Closing server');
  server.close((err) => {
    if (err) {
      return reject(err);
    }
    return resolve();
  });
}));

if (require.main === module) {
  runServer(DATABASE_URL).catch((err) => process.stderr.write(err));
}

module.exports = { app, runServer, closeServer };
