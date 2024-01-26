const db = require('../models/dbModel');

// create rectangle for RootContainer component
const createRootRectangle = (req, res, next) => {
  const pages = res.locals.design.pages;
  const rootId = pages[pages.length - 1].components[0]._id;
  const { imageHeight } = req.body;
  console.log(rootId, imageHeight);
  return db
    .query(
      'INSERT INTO rectangles (component_id, width, height) ' +
        'VALUES ($1, $2, $3) ' +
        'RETURNING *;',
      [rootId, 800, imageHeight]
    )
    .then((data) => {
      pages[pages.length - 1].components[0].rectangle = data.rows[0];
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught rectangleController.createRootRectangle middleware error' +
          err,
        message: { err: 'createRootRectangle: ' + err },
      })
    );
};

const updateRootRectangle = (req, res, next) => {
  const { rootId, imageHeight } = req.body;
  return db
    .query('UPDATE rectangles SET height = $1 WHERE component_id = $2;', [
      imageHeight,
      rootId,
    ])
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught rectangleController.createComponentRectangle middleware error' +
          err,
        message: { err: 'createComponentRectangle: ' + err },
      })
    );
};

const createComponentRectangle = (req, res, next) => {
  const componentId = res.locals.component._id;
  return db
    .query(
      'INSERT INTO rectangles (component_id, width, height) ' +
        'VALUES ($1, $2, $3) ' +
        'RETURNING *;',
      [componentId, 100, 100]
    )
    .then((data) => {
      res.locals.component.rectangle = data.rows[0];
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught rectangleController.createComponentRectangle middleware error' +
          err,
        message: { err: 'createComponentRectangle: ' + err },
      })
    );
};

const updateComponentRectanglePosition = (req, res, next) => {
  const { componentId } = req.params;
  const { x, y, width, height } = req.body;
  return db
    .query(
      'UPDATE rectangles SET x_position = $1, y_position = $2, width = $3, height = $4 WHERE component_id = $5 RETURNING *;',
      [x, y, width, height, componentId]
    )
    .then((data) => {
      res.locals.updatedRectangle = data.rows[0];
      return next();
    })
    .catch((err) =>
      next({
        log: `Express error handler caught rectangleController.updateComponentRectangle middleware error ${err}`,
        message: { err: `updateComponentRectangle: ${err}` },
      })
    );
};

const updateComponentRectangleStyle = (req, res, next) => {
  const { componentId } = req.params;
  const { styleToChange, value } = req.body;
  return db
    .query(
      `UPDATE rectangles SET  ${styleToChange} = $1 WHERE component_id = $2 RETURNING *;`,
      [value, componentId]
    )
    .then((data) => {
      res.locals.updatedRectangle = data.rows[0];
      return next();
    })
    .catch((err) =>
      next({
        log: `Express error handler caught rectangleController.updateComponentRectangle middleware error ${err}`,
        message: { err: `updateComponentRectangle: ${err}` },
      })
    );
};

const deleteDesignRectangles = (req, res, next) => {
  const ids = res.locals.deletedComponentIds.map(({ _id }) => _id);
  console.log(ids);
  return db
    .query('DELETE FROM rectangles WHERE component_id = ANY($1::int[]);', [ids])
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught rectangleController.deleteDesignRectangles middleware error: ' +
          err,
        message: { err: 'deleteDesignRectangles: ' + err },
      })
    );
};

const getRectangles = async (req, res, next) => {
  try {
    const pages = res.locals.design.pages;
    for (const page of pages) {
      const components = page.components;
      const rectanglePromises = components.map((item) =>
        db.query('SELECT * FROM rectangles WHERE component_id = $1;', [
          item._id,
        ])
      );
      const results = await Promise.all(rectanglePromises);
      results.forEach((data, i) => {
        components[i].rectangle = data.rows.length > 0 ? data.rows[0] : null;
      });
    }
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught rectangleController.getRectangles middleware error: ' +
        err,
      message: { err: 'getRectangles: ' + err },
    });
  }
};

const deleteComponentRectangle = (req, res, next) => {
  const { componentId } = req.params;
  return db
    .query('DELETE FROM rectangles WHERE component_id = $1;', [componentId])
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught rectangleController.deleteComponentRectangle middleware error: ' +
          err,
        message: { err: 'deleteComponentRectangle: ' + err },
      })
    );
};

module.exports = {
  createRootRectangle,
  deleteDesignRectangles,
  getRectangles,
  createComponentRectangle,
  deleteComponentRectangle,
  updateComponentRectanglePosition,
  updateComponentRectangleStyle,
  updateRootRectangle,
};
