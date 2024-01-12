const express = require('express');
const router = express.Router();
const path = require('path');

const userController = require('../controllers/userController');
const cookieController = require('../controllers/cookieController');

router.get('/', (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, '../../client/public/views/login.html'));
});

router.post(
  '/',
  userController.verifyUser,
  cookieController.setCookie,
  (req, res) => res.redirect('/home')
);

module.exports = router;
