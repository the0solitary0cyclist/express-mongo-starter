const express = require('express');

const router = express.Router();
const verificationController = require('./controllers');

router.get('/:userId/:token', (req, res) => {
  verificationController.verifyToken(req, res);
});

router.get('/', (req, res) => {
  // res.send('stuff')
  verificationController.verifyToken(req, res);
});

module.exports = { router };
