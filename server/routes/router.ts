import express, { Request, Response } from 'express';
import path from 'path';

import loginRouter from './loginRouter';
import signupRouter from './signupRouter';
import designsRouter from './designsRouter';
import componentsRouter from './componentsRouter';
import pageRouter from './pageRouter';

import {
  removeCookie,
  decryptCookie,
  checkCookie,
} from '../controllers/cookieController';
import { getUser, updateProfilePicture } from '../controllers/userController';
import { uploadImage, deleteImage } from '../controllers/imageController';
import { downloadFiles } from '../controllers/fileController';

const router = express.Router();

router.get('/logout', removeCookie, (req: Request, res: Response) =>
  res.status(200).end()
);

router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/designs', decryptCookie, designsRouter);
router.use('/components', decryptCookie, componentsRouter);
router.use('/pages', decryptCookie, pageRouter);

router.get('/user', decryptCookie, getUser, (req: Request, res: Response) =>
  res.status(200).json(res.locals.user)
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

router.get('/home', checkCookie, (req: Request, res: Response) => {
  const filePath: string = res.locals.verified
    ? '../../build/index.html'
    : '../../client/public/views/landingPage.html';
  return res.status(200).sendFile(path.join(__dirname, filePath));
});

export default router;
