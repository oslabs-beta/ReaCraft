import express, { Request, Response } from 'express';
import path from 'path';
import { setCookie } from '../controllers/cookieController';
import { verifyUser } from '../controllers/userController';

const router = express.Router();

router.get('/', (req: Request, res: Response) =>
  res
    .status(200)
    .sendFile(path.join(__dirname, '../../client/public/views/login.html'))
);

router.post('/', verifyUser, setCookie, (req: Request, res: Response) =>
  res.redirect('/home')
);

export default router;
