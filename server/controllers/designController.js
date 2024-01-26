const db = require('../models/dbModel');

//handle add new design
const addNewDesign = (req, res, next) => {
  // userId from cookieController.decryptCookie
  const { userId, onlineImageUrl } = res.locals;
  console.log(onlineImageUrl);
  return db
    .query(
      'INSERT INTO designs (user_id, image_url) VALUES( $1, $2 ) RETURNING *;',
      [userId, onlineImageUrl]
    )
    .then((data) => (res.locals.design = data.rows[0]))
    .then(() => next()) //next middleware is componentController.createRootComponent
    .catch((err) =>
      next({
        log:
          'Express error handler caught designController.addNewDesign middleware error' +
          err,
        message: { err: 'addDesign: ' + err },
      })
    );
};

const updateDesignTitle = (req, res, next) => {
  const { title } = req.body;
  const { designId } = req.params;
  return db
    .query(
      'UPDATE designs SET title = $1, last_updated = CURRENT_TIMESTAMP WHERE _id = $2 RETURNING *;',
      [title, designId]
    )
    .then((data) => (res.locals.design = data.rows[0]))
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught designController.updateDesignTitle middleware error' +
          err,
        message: { err: 'updateDesignTitle: ' + err },
      })
    );
};

const updateDesign = (req, res, next) => {
  const { onlineImageUrl } = res.locals;
  const { title } = req.body;
  const { designId } = req.params;
  console.log('onlineUrl, title, id', onlineImageUrl, title, designId);

  const columnToUpdate = onlineImageUrl ? 'image_url' : 'title';
  const updatedValue = onlineImageUrl ? onlineImageUrl : title;
  return db
    .query(
      `UPDATE designs SET ${columnToUpdate} = $1, last_updated = CURRENT_TIMESTAMP WHERE _id = $2 RETURNING *;`,
      [updatedValue, designId]
    )
    .then((data) => (res.locals.design = data.rows[0]))
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught designController.updateDesign middleware error' +
          err,
        message: { err: 'updateDesign: ' + err },
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

const deleteDesign = async (req, res, next) => {
  const designId = req.params.designId;
  try {
    const pageResponse = await db.query(
      'SELECT * FROM pages WHERE design_id = $1;',
      [designId]
    );
    res.locals.imageToDelete = [];
    pageResponse.rows.forEach((page) =>
      res.locals.imageToDelete.push(page.image_url)
    );
    await db.query('DELETE FROM designs WHERE _id = $1 RETURNING *;', [
      designId,
    ]);
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught designController.deleteDesign middleware error' +
        err,
      message: { err: 'deleteDesign: ' + err },
    });
  }
};

const getDesignById = (req, res, next) => {
  const designId = req.params.designId;
  return db
    .query('SELECT * FROM designs WHERE _id = $1;', [designId])
    .then((data) => {
      res.locals.design = data.rows[0];
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.getDesignById middleware error' +
          err,
        message: { err: 'getDesignById: ' + err },
      })
    );
};

module.exports = {
  getDesigns,
  deleteDesign,
  addNewDesign,
  updateDesignTitle,
  updateDesign,
  getDesignById,
};
