const { encrypt, decrypt } = require('../helpers/encryptDecrypt');

const checkCookie = (req, res, next) => {
  res.locals.verified = !!(req.cookies && req.cookies.sessionID);
  return next();
};

const setCookie = async (req, res, next) => {
  const userIdStr = String(res.locals.userId);
  console.log(encrypt(userIdStr));
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
    res.locals.userId = decrypt(req.cookies.sessionID);
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
