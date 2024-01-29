const { encrypt, decrypt } = require('../helpers/encryptDecrypt');
const db = require('../models/dbModel');

const checkCookie = (req, res, next) => {
  res.locals.verified = !!(req.cookies && req.cookies.sessionID);
  return next();
};

const setCookie = async (req, res, next) => {
  const userIdStr = String(res.locals.userId);
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

const decryptCookie = async (req, res, next) => {
  try {
    const userId = decrypt(req.cookies.sessionID);
    const userResponse = await db.query(
      'SELECT username FROM users WHERE _id = $1;',
      [userId]
    );
    if (userResponse.rows.length === 0) {
      return next({
        log:
          'Express error handler caught cookieController.decryptCookie middleware error' +
          'Username not found',
        message: 'Cookie err: ' + 'Username not found',
      });
    }
    res.locals.userId = userId;
    res.locals.username = userResponse.rows[0].username;
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

const removeCookie = (req, res, next) => {
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

module.exports = {
  checkCookie,
  setCookie,
  removeCookie,
  decryptCookie,
};
