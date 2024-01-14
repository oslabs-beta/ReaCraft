const db = require('../models/dbModel');

const createRootRectangle = (req, res, next) => {
  const rootId = res.locals.design.components[0]._id;
  console.log(rootId);
  return db
    .query(
      'INSERT INTO rectangles (component_id, isResizable) ' +
        'VALUES ($1, $2) ' +
        'RETURNING *;',
      [rootId, false]
    )
    .then((data) => {
      res.locals.design.components.rectangle = data.rows[0];
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

const createComponentRectangle = (req, res, next) => {
  const componentId = res.locals.component._id;
  return db
    .query(
      'INSERT INTO rectangles (component_id) ' +
        'VALUES ($1) ' +
        'RETURNING *;',
      [componentId]
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
    const components = res.locals.design.components;
    const rectanglePromises = components.map((item) =>
      db.query('SELECT * FROM rectangles WHERE component_id = $1;', [item._id])
    );
    const results = await Promise.all(rectanglePromises);
    results.forEach((data, i) => {
      components[i].rectangle = data.rows.length > 0 ? data.rows[0] : null;
    });
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
};
