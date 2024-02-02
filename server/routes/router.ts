import express, { Request, Response } from 'express';
import path from 'path';
import designsRouter from './designsRouter';
import componentsRouter from './componentsRouter';
import pageRouter from './pageRouter';
import {
  decryptCookie,
  checkCookie,
  setCookie,
} from '../controllers/cookieController';
import {
  addUser,
  checkEmail,
  checkUsername,
  hashPassword,
  updateProfilePicture,
  verifyUser,
} from '../controllers/userController';
import { uploadNewDesignImage, deleteImage } from '../controllers/imageController';
import { downloadFiles } from '../controllers/fileController';
import { authenticateGoogle, authenticateGoogleCallback, logoutUser } from '../controllers/passportController';
import passport from 'passport';

const router = express.Router();

router.get('/logout', logoutUser, (req: Request, res: Response) =>
res.status(200).end()
);

router.use('/designs', decryptCookie, designsRouter);
router.use('/components', decryptCookie, componentsRouter);
router.use('/pages', decryptCookie, pageRouter);

router.get('/user', decryptCookie, (req: Request, res: Response) =>
  res.status(200).json(res.locals.user)
);

router.post('/login', verifyUser, setCookie, (req: Request, res: Response) =>
  res.redirect('/home')
);

// google oauth routes
router.get('/auth/google', authenticateGoogle);
router.get('/auth/google/callback', authenticateGoogleCallback);

router.post(
  '/signup',
  checkEmail,
  checkUsername,
  addUser,
  hashPassword,
  setCookie,
  (req: Request, res: Response) => res.redirect('/home')
);

router.post('/download', downloadFiles);

router.post(
  '/update-profile',
  decryptCookie,
  deleteImage,
  uploadNewDesignImage,
  updateProfilePicture,
  (req: Request, res: Response) =>
    res.status(200).json({ imageUrl: res.locals.onlineImageUrl })
);

router.get('/', (req: Request, res: Response) => res.redirect('/home'));

router.get('/home', checkCookie, (req: Request, res: Response) => {
  const filePath: string = res.locals.verified
    ? '../../build/index.html'
    : '../../client/public/views/landingPage.html';
  return res.status(200).sendFile(path.join(__dirname, filePath));
});

export default router;
