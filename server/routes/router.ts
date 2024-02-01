import express, { Request, Response } from 'express';
import path from 'path';
import designsRouter from './designsRouter';
import componentsRouter from './componentsRouter';
import pageRouter from './pageRouter';
import {
  removeCookie,
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
import { uploadImage, deleteImage } from '../controllers/imageController';
import { downloadFiles } from '../controllers/fileController';

import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/logout', removeCookie, (req: Request, res: Response) =>
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
  uploadImage,
  updateProfilePicture,
  (req: Request, res: Response) =>
    res.status(200).json({ imageUrl: res.locals.onlineImageUrl })
);

router.get('/', (req: Request, res: Response) => res.redirect('/home'));

const PROJECT_ROOT = process.env.PROJECT_ROOT;
router.get('/home', checkCookie, (req: Request, res: Response) => {
  const filePath: string = res.locals.verified
    ? '/build/index.html'
    : '/client/public/views/landingPage.html';
  return res.status(200).sendFile(path.join(PROJECT_ROOT, filePath));
});

router.get('/bundle.js', (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(PROJECT_ROOT, '/build/bundle.js'));
});

export default router;
