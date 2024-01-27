const db = require('../models/dbModel');

const createPageForNewDesign = (req, res, next) => {
  const { onlineImageUrl, design } = res.locals;
  if (!design.pages) {
    design.pages = [];
  }
  console.log('pages are', design.pages);
  const index = design.pages.length;
  return db
    .query(
      'INSERT INTO pages (design_id, index, image_url) VALUES ($1, $2, $3) RETURNING *;',
      [design._id, index, onlineImageUrl]
    )
    .then((data) => {
      res.locals.design.pages.push(data.rows[0]);
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught pageController.createPageForNewDesign middleware error' +
          err,
        message: { err: 'createPageForNewDesign: ' + err },
      })
    );
};

const getPages = (req, res, next) => {
  const { designId } = req.params;
  return db
    .query('SELECT * FROM pages WHERE design_id = $1;', [designId])
    .then((data) => (res.locals.design.pages = data.rows))
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.getComponents middleware error' +
          err,
        message: { err: 'getComponents: ' + err },
      })
    );
};

const deletePageById = (req, res, next) => {
  const { pageId } = req.params;
  return db
    .query('DELETE FROM pages WHERE _id = $1 RETURNING index, design_id;', [
      pageId,
    ])
    .then((data) => {
      const { index, design_id } = data.rows[0];
      res.locals.indexDeleted = index;
      res.locals.designId = design_id;
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught pageController.deletePageById middleware error' +
          err,
        message: { err: 'deletePageById: ' + err },
      })
    );
};

const shiftPages = (req, res, next) => {
  const { indexDeleted, indexInserted, designId } = res.locals;
  const plusOrMinus = indexDeleted ? '-' : '+';
  const value = indexDeleted || indexInserted;
  return db
    .query(
      'UPDATE pages ' +
        `SET index = index ${plusOrMinus} 1 ` +
        'WHERE design_id = $1 AND index > $2 ' +
        'RETURNING _id, index;',
      [designId, value]
    )
    .then((data) => {
      res.locals.shiftedIndices = data.rows;
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught pageController.shiftPagesAfterDelete middleware error' +
          err,
        message: { err: 'shiftPagesAfterDelete: ' + err },
      })
    );
};

const addNewPage = (req, res, next) => {
  const { designId } = req.params;
  const { imageUrl, pageIdx } = req.body;
  return db
    .query(
      'INSERT INTO pages (design_id, index, image_url) VALUES ($1, $2, $3) RETURNING *;',
      [designId, pageIdx, imageUrl]
    )
    .then((data) => {
      res.locals.newPage = data.rows[0];
      res.locals.indexInserted = pageIdx;
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught pageController.addNewPage middleware error' +
          err,
        message: { err: 'addNewPage: ' + err },
      })
    );
};

module.exports = {
  createPageForNewDesign,
  getPages,
  deletePageById,
  shiftPages,
  addNewPage,
};
