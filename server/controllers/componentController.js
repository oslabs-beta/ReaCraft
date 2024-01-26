const { Request, Response, NextFunction } = require('express');
const db = require('../models/dbModel');

// Create a default RootContainer component for a new design
const createRootComponent = (req, res, next) => {
  const pages = res.locals.design.pages;
  const pageId = pages[pages.length - 1]._id;
  return db
    .query(
      'INSERT INTO components (page_id, index, name) ' +
        'VALUES ($1, $2, $3) ' +
        'RETURNING *;',
      [pageId, 0, 'RootContainer']
    )
    .then((data) => {
      res.locals.design.pages[pages.length - 1].components = [data.rows[0]];
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

const getComponents = async (req, res, next) => {
  try {
    const pages = res.locals.design.pages;
    const compPromises = pages.map((page) =>
      db.query('SELECT * FROM components WHERE page_id = $1;', [page._id])
    );
    const results = await Promise.all(compPromises);
    results.forEach((data, i) => {
      if (data.rows.length === 0) {
        throw new Error('A page has no components.');
      }
      pages[i].components = data.rows;
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

const addNewComponent = async (req, res, next) => {
  const { pageId } = req.params;
  const { name, index, rootId } = req.body;
  let data;
  try {
    const prevComponentRes = await db.query(
      'SELECT * FROM components WHERE page_id = $1 AND name = $2;',
      [pageId, name]
    );
    if (prevComponentRes.rows.length === 0) {
      data = await db.query(
        'INSERT INTO components (page_id, name, index, parent_id) VALUES ($1, $2, $3, $4) RETURNING *;',
        [pageId, name, index, rootId]
      );
      res.locals.component = data.rows[0];
      return next();
    } else {
      const { html_tag, inner_html } = prevComponentRes.rows[0];
      console.log('in addNewComponent', prevComponentRes.rows[0]);
      data = await db.query(
        'INSERT INTO components (page_id, name, index, parent_id, html_tag, inner_html) ' +
          'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [pageId, name, index, rootId, html_tag, inner_html]
      );
      console.log('in addNewComponent', data.rows);
      res.locals.component = data.rows[0];
      return next();
    }
  } catch (err) {
    return next({
      log:
        'Express error handler caught componentController.addNewComponent middleware error' +
        err,
      message: { err: 'addNewComponent: ' + err },
    });
  }
};

const deleteComponentById = (req, res, next) => {
  const { componentId } = req.params;
  return db
    .query('DELETE FROM components WHERE _id = $1 RETURNING index, page_id;', [
      componentId,
    ])
    .then((data) => {
      const { index, page_id } = data.rows[0];
      res.locals.indexDeleted = index;
      console.log('indexDeleted:', index);
      res.locals.pageId = page_id;
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
  const { indexDeleted, pageId } = res.locals;
  return db
    .query(
      'UPDATE components ' +
        'SET index = index - 1 ' +
        'WHERE page_id = $1 AND index > $2 ' +
        'RETURNING _id, index;',
      [pageId, indexDeleted]
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

const updateParent = async (req, res, next) => {
  const { componentId } = req.params;
  const { parentId } = req.body;

  try {
    await db.query('UPDATE components SET parent_id = $1 WHERE _id = $2;', [
      parentId,
      componentId,
    ]);
    const parentRes = await db.query(
      'SELECT name, page_id FROM components WHERE _id = $1;',
      [parentId]
    );
    res.locals.componentName = parentRes.rows[0].name;
    res.locals.pageId = parentRes.rows[0].page_id;
    res.locals.htmlTag = '<div>';
    res.locals.innerHtml = '';
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught componentController.updateParent middleware error' +
        err,
      message: { err: 'updateParent: ' + err },
    });
  }
};

const updateHtmlForAllSameComponents = async (req, res, next) => {
  const { componentName, htmlTag, pageId, innerHtml } = res.locals;
  console.log('updating html for all same components');
  if (!htmlTag) return next();
  try {
    const pageRes = await db.query(
      'SELECT design_id FROM pages WHERE _id = $1;',
      [pageId]
    );
    if (pageRes.rows.length !== 1)
      throw new Error('updateHtmlForAllSameComponents: design not found');
    const designId = pageRes.rows[0].design_id;
    const pagesRes = await db.query(
      'SELECT _id FROM pages WHERE design_id = $1;',
      [designId]
    );
    const pageIds = pagesRes.rows.map(({ _id }) => _id);
    await db.query(
      'UPDATE components SET html_tag = $1, inner_html = $2 WHERE name = $3 AND page_id = ANY($4::int[]);',
      [htmlTag, innerHtml, componentName, pageIds]
    );
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught componentController.updateHtmlForAllSameComponents middleware error' +
        err,
      message: { err: 'updateHtmlForAllSameComponents: ' + err },
    });
  }
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
  const { name, innerHtml, props, styles, htmlTag } = req.body;
  return db
    .query(
      'UPDATE components ' +
        'SET name = $1, ' +
        'inner_html = $2, ' +
        'html_tag = $6, ' +
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
        htmlTag,
      ]
    )
    .then((data) => {
      res.locals.updatedComponent = data.rows[0];
      res.locals.htmlTag = data.rows[0].html_tag;
      res.locals.componentName = data.rows[0].name;
      res.locals.designId = data.rows[0].design_id;
      res.locals.innerHtml = data.rows[0].inner_html;
      res.locals.pageId = data.rows[0].page_id;
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
  createRootComponent,
  addNewComponent,
  deleteComponentById,
  shiftComponentsAfterDelete,
  updateParent,
  resetParentHtml,
  updateComponentForm,
  updateHtmlForAllSameComponents,
};
