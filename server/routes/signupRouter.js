const express = require('express');
const router = express.Router();
const path = require('path');

const userController = require('../controllers/userController');
const cookieController = require('../controllers/cookieController');

router.post(
  '/',
  userController.checkEmail,
  userController.checkUsername,
  userController.addUser,
  userController.hashPassword,
  cookieController.setCookie,
  (req, res) => res.redirect('/home')
);

router.get('/', (req, res) =>
  res
    .status(200)
    .sendFile(path.join(__dirname, '../../client/public/views/signup.html'))
);

module.exports = router;
