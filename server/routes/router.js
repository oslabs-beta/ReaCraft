const express = require('express');
const router = express.Router();
const path = require('path');

const userController = require('../controllers/userController');
const cookieController = require('../controllers/cookieController');

const loginRouter = require('./loginRouter');
const signupRouter = require('./signupRouter');
const designsRouter = require('./designsRouter');

router.get('/logout', cookieController.removeCookie, (req, res) => {
  res.status(200).end();
});

router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/designs', cookieController.decryptCookie, designsRouter);

router.get(
  '/user',
  cookieController.decryptCookie,
  userController.getUser,
  (req, res) => res.status(200).json(res.locals.user)
);

router.get('/home', cookieController.checkCookie, (req, res) => {
  console.log(res.locals.verified);
  const filePath = res.locals.verified
    ? '../../build/index.html'
    : '../../client/public/views/login.html';
  console.log(filePath);
  return res.status(200).sendFile(path.join(__dirname, filePath));
});

router.get('/', (req, res) => {
  return res.redirect('/home');
});

module.exports = router;
