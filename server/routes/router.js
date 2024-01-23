const express = require('express');
const router = express.Router();
const path = require('path');

const userController = require('../controllers/userController');
const cookieController = require('../controllers/cookieController');
const imageController = require('../controllers/imageController');
const fileController = require('../controllers/fileController');

const loginRouter = require('./loginRouter');
const signupRouter = require('./signupRouter');
const designsRouter = require('./designsRouter');
const componentsRouter = require('./componentsRouter');

router.get('/logout', cookieController.removeCookie, (req, res) => {
  res.status(200).end();
});

router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/designs', cookieController.decryptCookie, designsRouter);
router.use('/components', componentsRouter);

router.get(
  '/user',
  cookieController.decryptCookie,
  userController.getUser,
  (req, res) => res.status(200).json(res.locals.user)
);

router.post('/download', fileController.downloadFiles);

router.post(
  '/update-profile',
  cookieController.decryptCookie,
  imageController.deleteImage,
  imageController.uploadImage,
  userController.updateProfilePicture,
  (req, res) => res.status(200).json({ imageUrl: res.locals.onlineImageUrl })
);

router.get('/', (req, res) => {
  return res.redirect('/home');
});

router.get('/home', cookieController.checkCookie, (req, res) => {
  const filePath = res.locals.verified
    ? '../../build/index.html'
    : '../../client/public/views/landingPage.html';
  return res.status(200).sendFile(path.join(__dirname, filePath));
});

module.exports = router;
