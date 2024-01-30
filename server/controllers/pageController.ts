import { Request, Response, NextFunction } from 'express';
import db from '../models/dbModel';
import { Design, PageQueryRes } from '../../docs/types';

export const createPageForNewDesign = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const design: Design = res.locals.design;
  const onlineImageUrl: string = res.locals.onlineImageUrl;
  if (!design.pages) {
    design.pages = [];
  }
  const index: number = design.pages.length;
  return db
    .query(
      'INSERT INTO pages (design_id, index, image_url) VALUES ($1, $2, $3) RETURNING *;',
      [design._id, index, onlineImageUrl]
    )
    .then((data: PageQueryRes) => {
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

export const getPages = (req: Request, res: Response, next: NextFunction) => {
  const designId: number = Number(req.params.designId);
  return db
    .query('SELECT * FROM pages WHERE design_id = $1;', [designId])
    .then((data: PageQueryRes) => (res.locals.design.pages = data.rows))
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

export const deletePageById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pageId: number = Number(req.params.pageId);
  return db
    .query('DELETE FROM pages WHERE _id = $1 RETURNING index, design_id;', [
      pageId,
    ])
    .then((data: { rows: { index: number; design_id: number }[] }) => {
      const { index, design_id } = data.rows[0];
      res.locals.indexDeleted = index;
      res.locals.designId = design_id;
      res.locals.pageId = pageId;
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

export const shiftPages = (req: Request, res: Response, next: NextFunction) => {
  const { indexDeleted, indexInserted, designId, pageId } = res.locals;
  const plusOrMinus: '-' | '+' = indexDeleted !== undefined ? '-' : '+';
  const value: number =
    indexDeleted !== undefined ? indexDeleted : indexInserted;
  return db
    .query(
      'UPDATE pages ' +
        `SET index = index ${plusOrMinus} 1 ` +
        'WHERE design_id = $1 AND index >= $2 AND _id <> $3 ' +
        'RETURNING _id, index;',
      [designId, value, pageId]
    )
    .then((data: { rows: { _id: number; index: number }[] }) => {
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

export const addNewPage = (req: Request, res: Response, next: NextFunction) => {
  const designId: number = Number(req.params.designId);
  const { pageIdx } = req.body;
  const { onlineImageUrl } = res.locals;
  return db
    .query(
      'INSERT INTO pages (design_id, index, image_url) VALUES ($1, $2, $3) RETURNING *;',
      [designId, pageIdx, onlineImageUrl]
    )
    .then((data: PageQueryRes) => {
      res.locals.newPage = data.rows[0];
      res.locals.designId = data.rows[0].design_id;
      res.locals.indexInserted = pageIdx;
      res.locals.pageId = data.rows[0]._id;
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

export const getDesignId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let pageId: number = res.locals.pageId;
  if (!pageId) pageId = Number(req.params.pageId);
  return db
    .query('SELECT design_id FROM pages WHERE _id = $1;', [pageId])
    .then((data: { rows: { design_id: number }[] }) => {
      res.locals.designId = data.rows[0].design_id;
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
  createPageForNewDesign,
  getPages,
  deletePageById,
  shiftPages,
  addNewPage,
  getDesignId,
};
