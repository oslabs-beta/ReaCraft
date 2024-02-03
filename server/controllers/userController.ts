import { Request, Response, NextFunction } from 'express';
import db from '../models/dbModel';

export type userRow = {
  _id: number;
  username: string;
  email: string;
  profile_image: string;
  created_at: string;
  last_login: string;
};

export type userQueryRes = {
  rows: userRow[];
};

export const checkUsername = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;
  return db
    .query('SELECT * FROM users WHERE username = $1', [username])
    .then((data: userQueryRes) =>
      data.rows.length === 0
        ? next()
        : next({
            log: 'Express error handler caught userController.addUser middleware error: Username in user',
            status: 400,
            message: 'Username in use',
          })
    );
};

export const checkEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  return db
    .query('SELECT * FROM users WHERE email = $1', [email])
    .then((data: userQueryRes) =>
      data.rows.length === 0
        ? next()
        : next({
            log: 'Express error handler caught userController.addUser middleware error: Email in user',
            status: 400,
            message: 'Email in use.',
          })
    );
};

export const addUser = (req: Request, res: Response, next: NextFunction) => {
  const { username, email } = req.body;
  return db
    .query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING _id;',
      [username, email]
    )
    .then(
      (data: { rows: { _id: number }[] }) =>
        (res.locals.userId = data.rows[0]._id)
    )
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught userController.addUser middleware error' +
          err,
        message: { err: 'addUser: ' + err },
      })
    );
};

export const hashPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const userId = res.locals.userId;
  return db
    .query(
      "INSERT INTO passwords (user_id, hashed_psw) VALUES ($1, crypt($2, gen_salt('md5')))",
      [userId, password]
    )
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught userController.hashPassword middleware error' +
          err,
        message: { err: 'hashPassword: ' + err },
      })
    );
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  try {
    const userData: { rows: { _id: number }[] } = await db.query(
      'SELECT _id FROM users WHERE username = $1;',
      [username]
    );
    const user = userData.rows[0];
    if (!user)
      return next({
        log: 'Express error handler caught userController.verifyUser middleware error: Username not found',
        status: 400,
        message: 'VerifyUser Err: Username not found.',
      });

    const pswMatched: { rows: { user_id: number }[] } = await db.query(
      'SELECT user_id FROM passwords WHERE user_id = $1 AND hashed_psw = crypt($2, hashed_psw);',
      [user._id, password]
    );
    if (pswMatched.rows.length === 0)
      return next({
        log: 'Express error handler caught userController.verifyUser middleware error: Password incorrect',
        status: 400,
        message: 'VerifyUser Err: Password incorrect.',
      });

    res.locals.userId = user._id;
    await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE _id = $1;',
      [user._id]
    );
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught userController.verifyUser middleware error: ' +
        err,
      message: 'verifyUser ' + err,
    });
  }
};

export const updateProfilePicture = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, onlineImageUrl } = res.locals;
  return db
    .query('UPDATE users SET profile_image = $1 WHERE _id = $2;', [
      onlineImageUrl,
      userId,
    ])
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught userController.updateProfilePicture middleware error: ' +
          err,
        message: 'updateProfilePicture ' + err,
      })
    );
};

export const updateUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = res.locals;
  const { newUsername } = req.body;
  try {
    const userQueryRes: userQueryRes = await db.query(
      'SELECT * FROM users WHERE username = $1;',
      [newUsername]
    );
    console.log(userQueryRes.rows);
    if (userQueryRes.rows.length > 0) {
      res.locals.status = 400;
      res.locals.message = 'Username in use';
    } else {
      await db.query('UPDATE users SET username = $1 WHERE _id = $2;', [
        newUsername,
        userId,
      ]);
      res.locals.status = 200;
      res.locals.message = 'Updated username successfully';
    }
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught userController.updateUsername middleware error: ' +
        err,
      message: 'updateUsername ' + err,
    });
  }
};
