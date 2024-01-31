import { userQueryRes, userRow } from '../../docs/types';
import { encrypt, decrypt } from '../helpers/encryptDecrypt';
import db from '../models/dbModel';
import { Request, Response, NextFunction } from 'express';

export const checkCookie = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.verified = !!(req.cookies && req.cookies.sessionID);
  return next();
};

export const setCookie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userIdStr: string = String(res.locals.userId);
  try {
    res.cookie('sessionID', encrypt(userIdStr));
    return next();
  } catch (err) {
    console.error('ERROR: ', err);
    return next({
      log:
        'Express error handler caught cookieController.setCookie middleware error' +
        err,
      message: 'Cookie err: ' + err,
    });
  }
};

export const decryptCookie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: number = Number(decrypt(req.cookies.sessionID));
    const userResponse: userQueryRes = await db.query(
      'SELECT * FROM users WHERE _id = $1;',
      [userId]
    );
    if (userResponse.rows.length === 0) {
      return next({
        log:
          'Express error handler caught cookieController.decryptCookie middleware error' +
          'Username not found',
        message: 'Cookie err: ' + 'UserId not found',
      });
    }
    const user: userRow = userResponse.rows[0];
    res.locals.userId = user._id;
    res.locals.username = user.username;
    res.locals.user = user;
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught cookieController.decryptCookie middleware error' +
        err,
      message: 'Cookie err: ' + err,
    });
  }
};

export const removeCookie = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie('user_id');
    res.clearCookie('sessionID');
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught cookieController.removeCookie middleware error' +
        err,
      message: 'Cookie err: ' + err,
    });
  }
};
