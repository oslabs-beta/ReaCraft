const db = require('../models/dbModel');

const checkUsername = (req, res, next) => {
  const { username } = req.body;
  return db
    .query('SELECT * FROM users WHERE username = $1', [username])
    .then((data) =>
      data.rows.length === 0
        ? next()
        : next({
            log: 'Express error handler caught userController.addUser middleware error: Username in user',
            status: 400,
            message: 'Username in use',
          })
    );
};

const checkEmail = (req, res, next) => {
  const { email } = req.body;
  return db
    .query('SELECT * FROM users WHERE email = $1', [email])
    .then((data) =>
      data.rows.length === 0
        ? next()
        : next({
            log: 'Express error handler caught userController.addUser middleware error: Email in user',
            status: 400,
            message: 'Email in use.',
          })
    );
};

const addUser = (req, res, next) => {
  const { username, email } = req.body;
  return db
    .query('INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;', [
      username,
      email,
    ])
    .then((data) => (res.locals.userId = data.rows[0]._id))
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

const hashPassword = (req, res, next) => {
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

const verifyUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const userData = await db.query(
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

    const pswMatched = await db.query(
      'SELECT * FROM passwords WHERE user_id = $1 AND hashed_psw = crypt($2, hashed_psw);',
      [user._id, password]
    );
    if (pswMatched.rows.length === 0)
      return next({
        log: 'Express error handler caught userController.verifyUser middleware error: Password incorrect',
        status: 400,
        message: 'VerifyUser Err: Password incorrect.',
      });

    res.locals.userId = user._id;
    await db.query('UPDATE users SET last_login = $2 WHERE _id = $1;', [
      user._id,
      new Date(),
    ]);
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

const getUser = async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    const response = await db.query('SELECT * FROM users WHERE _id = $1;', [
      userId,
    ]);
    if (response.rows.length === 0)
      return next({
        log:
          'Express error handler caught userController.getUser middleware error: ' +
          'user id not found',
        message: 'user id not found ',
      });
    res.locals.user = response.rows[0];
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught userController.getUser middleware error: ' +
        err,
      message: 'getUser ' + err,
    });
  }
};

module.exports = {
  checkUsername,
  checkEmail,
  addUser,
  hashPassword,
  verifyUser,
  getUser,
};
