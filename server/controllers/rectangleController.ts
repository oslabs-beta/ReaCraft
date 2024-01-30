import { Request, Response, NextFunction } from 'express';
import db from '../models/dbModel';
import { ComponentRow, Page, RectangleQueryRes } from '../../docs/types';

// create rectangle for RootContainer component
export const createRootRectangle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let rootId: Number;
  if (res.locals.design) {
    const pages: Page[] = res.locals.design.pages;
    rootId = pages[pages.length - 1].components[0]._id;
  } else {
    rootId = res.locals.newPage.components[0]._id;
  }
  const { imageHeight } = req.body;
  return db
    .query(
      'INSERT INTO rectangles (component_id, width, height) ' +
        'VALUES ($1, $2, $3) ' +
        'RETURNING *;',
      [rootId, 800, imageHeight]
    )
    .then((data: RectangleQueryRes) => {
      if (res.locals.design) {
        res.locals.design.pages[0].components[0].rectangle = data.rows[0];
      } else {
        res.locals.newPage.components[0].rectangle = data.rows[0];
      }
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

export const updateRootRectangle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const createComponentRectangle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const componentId: number = res.locals.component._id;
  return db
    .query(
      'INSERT INTO rectangles (component_id, width, height) ' +
        'VALUES ($1, $2, $3) ' +
        'RETURNING *;',
      [componentId, 100, 100]
    )
    .then((data: RectangleQueryRes) => {
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

export const updateComponentRectanglePosition = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const componentId: number = Number(req.params.componentId);
  const { x, y, width, height } = req.body;
  return db
    .query(
      'UPDATE rectangles SET x_position = $1, y_position = $2, width = $3, height = $4 WHERE component_id = $5 RETURNING *;',
      [x, y, width, height, componentId]
    )
    .then((data: RectangleQueryRes) => {
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

export const updateComponentRectangleStyle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const componentId: number = Number(req.params.componentId);
  const { styleToChange, value } = req.body;
  return db
    .query(
      `UPDATE rectangles SET  ${styleToChange} = $1 WHERE component_id = $2 RETURNING *;`,
      [value, componentId]
    )
    .then((data: RectangleQueryRes) => {
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

export const getRectangles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pages: Page[] = res.locals.design.pages;
    for (const page of pages) {
      const components = page.components;
      const rectanglePromises = components.map(
        (item): Promise<RectangleQueryRes> =>
          db.query('SELECT * FROM rectangles WHERE component_id = $1;', [
            item._id,
          ])
      );
      const results = await Promise.all(rectanglePromises);
      results.forEach((data: RectangleQueryRes, i: number) => {
        if (data.rows.length === 0) {
          throw new Error('A component has now rectangle');
        }
        components[i].rectangle = data.rows[0];
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

export default {
  createRootRectangle,
  getRectangles,
  createComponentRectangle,
  updateComponentRectanglePosition,
  updateComponentRectangleStyle,
  updateRootRectangle,
};
