import { Request, Response, NextFunction } from 'express';
import db from '../models/dbModel';
import { ComponentQueryRes, Page, PageQueryRes } from '../../docs/types';

// Create a default RootContainer component for a new design
export const createRootComponent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let pageId: number;
  let pageIdx: number;
  if (res.locals.design) {
    const pages: Page[] = res.locals.design.pages;
    pageId = pages[pages.length - 1]._id;
    pageIdx = 0;
  } else if (res.locals.newPage) {
    pageId = res.locals.newPage._id;
    pageIdx = res.locals.newPage.index;
  } else {
    throw new Error('No page to create new root component');
  }
  return db
    .query(
      'INSERT INTO components (page_id, index, name) ' +
        'VALUES ($1, $2, $3) ' +
        'RETURNING *;',
      [pageId, 0, `Page${pageIdx}`]
    )
    .then((data) => {
      if (res.locals.design) {
        res.locals.design.pages[0].components = [data.rows[0]];
      } else {
        res.locals.newPage.components = [data.rows[0]];
      }
      return next();
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

export const getComponents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pages: Page[] = res.locals.design.pages;
    const compPromises: Promise<ComponentQueryRes>[] = pages.map((page) =>
      db.query('SELECT * FROM components WHERE page_id = $1;', [page._id])
    );
    const results: any[] = await Promise.all(compPromises);
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

export const addNewComponent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pageId: number = Number(req.params.pageId);
  const name: string = req.body.name;
  const index: number = req.body.index;
  const rootId: number = req.body.rootId;
  let componentRes: ComponentQueryRes;
  try {
    const prevComponentRes: ComponentQueryRes = await db.query(
      'SELECT * FROM components WHERE page_id = $1 AND name = $2;',
      [pageId, name]
    );
    if (prevComponentRes.rows.length === 0) {
      componentRes = await db.query(
        'INSERT INTO components (page_id, name, index, parent_id) VALUES ($1, $2, $3, $4) RETURNING *;',
        [pageId, name, index, rootId]
      );
      res.locals.component = componentRes.rows[0];
      return next();
    } else {
      const { html_tag, inner_html } = prevComponentRes.rows[0];
      componentRes = await db.query(
        'INSERT INTO components (page_id, name, index, parent_id, html_tag, inner_html) ' +
          'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [pageId, name, index, rootId, html_tag, inner_html]
      );
      res.locals.component = componentRes.rows[0];
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

export const deleteComponentById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const componentId: number = Number(req.params.componentId);
  return db
    .query('DELETE FROM components WHERE _id = $1 RETURNING index, page_id;', [
      componentId,
    ])
    .then((data: { rows: { index: number; page_id: number }[] }) => {
      const { index, page_id } = data.rows[0];
      res.locals.indexDeleted = index;
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

export const shiftComponentsAfterDelete = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { indexDeleted, pageId } = res.locals;
  return db
    .query(
      'UPDATE components ' +
        'SET index = index - 1 ' +
        'WHERE page_id = $1 AND index > $2 ' +
        'RETURNING _id, index;',
      [pageId, indexDeleted]
    )
    .then((data: { rows: { _id: number; index: number }[] }) => {
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

export const updateParent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const componentId: number = Number(req.params.componentId);
  const parentId: number = req.body.parentId;

  try {
    await db.query('UPDATE components SET parent_id = $1 WHERE _id = $2;', [
      parentId,
      componentId,
    ]);
    const parentRes: { rows: { name: string; page_id: number }[] } =
      await db.query('SELECT name, page_id FROM components WHERE _id = $1;', [
        parentId,
      ]);
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

export const updateHtmlForAllSameComponents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { componentName, htmlTag, pageId, innerHtml } = res.locals;
  if (!htmlTag) return next();
  try {
    const pageRes: PageQueryRes = await db.query(
      'SELECT design_id FROM pages WHERE _id = $1;',
      [pageId]
    );
    if (pageRes.rows.length !== 1)
      throw new Error('updateHtmlForAllSameComponents: design not found');
    const designId = pageRes.rows[0].design_id;
    const pagesRes: PageQueryRes = await db.query(
      'SELECT _id FROM pages WHERE design_id = $1;',
      [designId]
    );
    const pageIds: number[] = pagesRes.rows.map(({ _id }) => _id);
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

export const resetParentHtml = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parentId: number = req.body.parentId;
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

export const updateComponentForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const componentId: number = Number(req.params.componentId);
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
    .then((data: ComponentQueryRes) => {
      res.locals.updatedComponent = data.rows[0];
      res.locals.htmlTag = data.rows[0].html_tag;
      res.locals.componentName = data.rows[0].name;
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

export const updateRootComponentNameForShiftedPages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const shifted: { _id: number; index: number }[] = res.locals.shiftedIndices;
  try {
    for (const { _id, index } of shifted) {
      await db.query(
        'UPDATE components SET name = $1 WHERE page_id = $2 AND index = 0;',
        [`Page${index}`, _id]
      );
    }
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught componentController.updateRootComponentNameForShiftedPages middleware error' +
        err,
      message: { err: 'updateRootComponentNameForShiftedPages: ' + err },
    });
  }
};

export const getPageId = (req: Request, res: Response, next: NextFunction) => {
  let componentId: number | undefined = res.locals.componentId;
  if (!componentId) componentId = Number(req.params.componentId);
  return db
    .query('SELECT page_id FROM components WHERE _id = $1;', [componentId])
    .then((data: { rows: { page_id: number }[] }) => {
      res.locals.pageId = data.rows[0].page_id;
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught pageController.getDesignId middleware error' +
          err,
        message: { err: 'getDesignId: ' + err },
      })
    );
};

export default {
  getComponents,
  createRootComponent,
  addNewComponent,
  deleteComponentById,
  shiftComponentsAfterDelete,
  updateParent,
  resetParentHtml,
  updateComponentForm,
  updateHtmlForAllSameComponents,
  updateRootComponentNameForShiftedPages,
  getPageId,
};
