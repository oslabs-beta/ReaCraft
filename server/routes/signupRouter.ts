import express, { Request, Response } from 'express';
import path from 'path';

import {
  checkEmail,
  checkUsername,
  addUser,
  hashPassword,
} from '../controllers/userController';

import { setCookie } from '../controllers/cookieController';

const router = express.Router();
router.post(
  '/',
  checkEmail,
  checkUsername,
  addUser,
  hashPassword,
  setCookie,
  (req: Request, res: Response) => res.redirect('/home')
);

router.get('/', (req: Request, res: Response) =>
  res
    .status(200)
    .sendFile(path.join(__dirname, '../../client/public/views/signup.html'))
);

export default router;
