const db = require('../models/dbModel');

// Create a default RootContainer component for a new design
const createRootComponent = (req, res, next) => {
  // designId from designController.addNewDesign
  const designId = res.locals.design._id;
  return db
    .query(
      'INSERT INTO components (design_id, index, name) ' +
        'VALUES ($1, $2, $3) ' +
        'RETURNING *;',
      [designId, 0, 'RootContainer']
    )
    .then((data) => {
      res.locals.design.components = [data.rows[0]];
      return next(); // next middleware is rectangleController.createRootRectangle
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.createRootComponent middleware error' +
          err,
        message: { err: 'createRootComponent: ' + err },
      })
    );
};

const getComponents = (req, res, next) => {
  const designId = req.params.designId;
  return db
    .query('SELECT * FROM components WHERE design_id = $1;', [designId])
    .then((data) => (res.locals.design.components = data.rows))
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

const selectDesignComponentsToDelete = (req, res, next) => {
  const designId = req.params.designId;
  return db
    .query('SELECT * FROM components WHERE design_id = $1;', [designId])
    .then((data) => {
      res.locals.deletedComponentIds = data.rows;
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.selectDesignComponentsToDelete middleware error' +
          err,
        message: { err: 'selectDesignComponentsToDelete: ' + err },
      })
    );
};

const deleteDesignComponents = (req, res, next) => {
  const designId = req.params.designId;
  return db
    .query('DELETE FROM components WHERE design_id = $1;', [designId])
    .then((data) => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.selectDesignComponentsToDelete middleware error' +
          err,
        message: { err: 'selectDesignComponentsToDelete: ' + err },
      })
    );
};

const addNewComponent = (req, res, next) => {
  const { designId } = req.params;
  const { name, index, rootId } = req.body;
  return db
    .query(
      'INSERT INTO components (design_id, name, index, parent_id) VALUES ($1, $2, $3, $4) RETURNING *;',
      [designId, name, index, rootId]
    )
    .then((data) => {
      res.locals.component = data.rows[0];
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.addNewComponent middleware error' +
          err,
        message: { err: 'addNewComponent: ' + err },
      })
    );
};

const deleteComponentById = (req, res, next) => {
  const { componentId } = req.params;
  return db
    .query(
      'DELETE FROM components WHERE _id = $1 RETURNING index, design_id;',
      [componentId]
    )
    .then((data) => {
      const { index, design_id } = data.rows[0];
      res.locals.indexDeleted = index;
      console.log('indexDeleted:', index);
      res.locals.designId = design_id;
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.deleteComponentById middleware error' +
          err,
        message: { err: 'deleteComponentById: ' + err },
      })
    );
};

const shiftComponentsAfterDelete = (req, res, next) => {
  const { indexDeleted, designId } = res.locals;
  return db
    .query(
      'UPDATE components ' +
        'SET index = index - 1 ' +
        'WHERE design_id = $1 AND index > $2 ' +
        'RETURNING _id, index;',
      [designId, indexDeleted]
    )
    .then((data) => {
      res.locals.shiftedIndices = data.rows;
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.shiftComponentsAfterDelete middleware error' +
          err,
        message: { err: 'shiftComponentsAfterDelete: ' + err },
      })
    );
};

const updateParentOrTag = (req, res, next) => {
  const { componentId } = req.params;
  const { parentId, htmlTag } = req.body;
  const columnKey = parentId ? 'parent_id' : 'html_tag';
  const columnValue = parentId ? parentId : htmlTag;
  return db
    .query(
      `UPDATE components SET ${columnKey} = $1 WHERE _id = $2 RETURNING *;`,
      [columnValue, componentId]
    )
    .then((data) => {
      res.locals.componentId = componentId;
      res.locals.parentId = parentId;
      res.locals.htmlTag = htmlTag;
      res.locals.componentName = data.rows[0].name;
      res.locals.designId = data.rows[0].design_id;
      res.locals.innerHtml = data.rows[0].inner_html;
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.updateParent middleware error' +
          err,
        message: { err: 'updateParent: ' + err },
      })
    );
};

const updateHtmlForAllSameComponents = (req, res, next) => {
  const { componentName, htmlTag, designId, innerHtml } = res.locals;
  console.log('updating html for all same components');
  if (!htmlTag) return next();
  return db
    .query(
      'UPDATE components SET html_tag = $1, inner_html = $4 WHERE name = $2 AND design_id = $3 RETURNING *;',
      [htmlTag, componentName, designId, innerHtml]
    )
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.updateHtmlForAllSameComponents middleware error' +
          err,
        message: { err: 'updateHtmlForAllSameComponents: ' + err },
      })
    );
};

const resetParentHtml = (req, res, next) => {
  const { parentId } = req.body;
  return db
    .query(
      'UPDATE components SET html_tag = $1, inner_html = $2 WHERE _id = $3;',
      ['<div>', '', parentId]
    )
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.resetParentHtml middleware error' +
          err,
        message: { err: 'resetParentHtml: ' + err },
      })
    );
};

const updateComponentForm = (req, res, next) => {
  const { componentId } = req.params;
  const { name, innerHtml, props, styles } = req.body;
  return db
    .query(
      'UPDATE components ' +
        'SET name = $1, ' +
        'inner_html = $2, ' +
        'props = $3, ' +
        'styles = $4 ' +
        'WHERE _id = $5 ' +
        'RETURNING *;',
      [
        name,
        innerHtml,
        JSON.stringify(props),
        JSON.stringify(styles),
        componentId,
      ]
    )
    .then((data) => {
      res.locals.updatedComponent = data.rows[0];
      res.locals.htmlTag = data.rows[0].html_tag;
      res.locals.componentName = data.rows[0].name;
      res.locals.designId = data.rows[0].design_id;
      res.locals.innerHtml = data.rows[0].inner_html;
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.updateComponentForm middleware error' +
          err,
        message: { err: 'updateComponentForm: ' + err },
      })
    );
};

module.exports = {
  getComponents,
  selectDesignComponentsToDelete,
  createRootComponent,
  addNewComponent,
  deleteComponentById,
  shiftComponentsAfterDelete,
  deleteDesignComponents,
  updateParentOrTag,
  resetParentHtml,
  updateComponentForm,
  updateHtmlForAllSameComponents,
};
