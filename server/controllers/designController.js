const db = require('../models/dbModel');

const addDesign = (req, res, next) => {
  const { userId, onlineImageUrl } = res.locals;
  const { title } = req.body;
  return db
    .query(
      'INSERT INTO designs (user_id, image_url, title) ' +
        'VALUES( $1, $2, $3) ' +
        'RETURNING *;',
      [userId, onlineImageUrl, title]
    )
    .then((data) => (res.locals.designId = data.rows[0]._id))
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught designController.addDesign middleware error' +
          err,
        message: { err: 'addDesign: ' + err },
      })
    );
};

const getDesigns = (req, res, next) => {
  const userId = res.locals.userId;
  return db
    .query('SELECT * FROM designs WHERE user_id = $1;', [userId])
    .then((data) => (res.locals.designs = data.rows))
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught designController.getDesigns middleware error' +
          err,
        message: { err: 'getDesigns: ' + err },
      })
    );
};

module.exports = { addDesign, getDesigns };
