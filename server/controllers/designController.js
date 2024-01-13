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

const deleteDesign = (req, res, next) => {
  const designId = req.params.designId;
  return db
    .query('DELETE FROM designs WHERE _id = $1 RETURNING *;', [designId])
    .then((data) => {
      const image_url = new URL(data.rows[0].image_url);
      res.locals.imageToDelete = image_url.pathname.slice(1);
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.deleteDesignComponents middleware error' +
          err,
        message: { err: 'deleteDesignComponents: ' + err },
      })
    );
};

module.exports = { addDesign, getDesigns, deleteDesign };
