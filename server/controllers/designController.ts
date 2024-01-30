import { Request, Response, NextFunction } from 'express';
import db from '../models/dbModel';
import {
  CollaboratorQueryRes,
  Design,
  DesignQueryRes,
  DesignRow,
  PageQueryRes,
} from '../../docs/types';

//handle add new design
export const addNewDesign = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // userId from cookieController.decryptCookie
  const { userId, onlineImageUrl, username } = res.locals;
  return db
    .query(
      'INSERT INTO designs (user_id, image_url, last_updated_by) VALUES( $1, $2, $3 ) RETURNING *;',
      [userId, onlineImageUrl, username]
    )
    .then((data: DesignQueryRes) => (res.locals.design = data.rows[0]))
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

export const updateDesignTitleOrCover = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, imageUrl } = req.body;
  const designId: number = Number(req.params.designId);
  const column: string = title ? 'title' : 'image_url';
  const value: string = title || imageUrl;
  return db
    .query(`UPDATE designs SET ${column} = $1 WHERE _id = $2 RETURNING *;`, [
      value,
      designId,
    ])
    .then((data: DesignQueryRes) => (res.locals.design = data.rows[0]))
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

export const getDesigns = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = res.locals;
  try {
    const ownedDesignsRes: DesignQueryRes = await db.query(
      'SELECT *  FROM designs WHERE user_id = $1;',
      [userId]
    );
    const ownedDesigns: DesignRow[] = ownedDesignsRes.rows;
    const collabResponse: CollaboratorQueryRes = await db.query(
      'SELECT * FROM collaborators WHERE collaborator_id = $1;',
      [userId]
    );
    const designIds: number[] = collabResponse.rows.map((row) => row.design_id);
    const collabDesignsRes: DesignQueryRes = await db.query(
      'SELECT * FROM designs WHERE _id = ANY($1::int[]);',
      [designIds]
    );
    const collabDesigns: Design[] = [...collabDesignsRes.rows];
    collabDesigns.forEach((design) => {
      const collabRow = collabResponse.rows.find(
        (row) => row.design_id === design._id
      );
      if (!collabRow) {
        throw new Error('Collaboration not found.');
      }
      design.canEdit = collabRow.can_edit;
    });
    const collabIds: number[] = collabDesigns.map((design) => design._id);
    res.locals.designs = [
      ...ownedDesigns.filter((design) => !collabIds.includes(design._id)),
      ...collabDesigns,
    ];
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught designController.getDesigns middleware error' +
        err,
      message: { err: 'getDesigns: ' + err },
    });
  }
};

export const deleteDesign = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const designId: number = Number(req.params.designId);
  try {
    const pageResponse: PageQueryRes = await db.query(
      'SELECT * FROM pages WHERE design_id = $1;',
      [designId]
    );
    res.locals.imageToDelete = [];
    pageResponse.rows.forEach((page) =>
      res.locals.imageToDelete.push(page.image_url)
    );
    await db.query('DELETE FROM designs WHERE _id = $1;', [designId]);
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

export const getDesignById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const designId: number = Number(req.params.designId);
  return db
    .query('SELECT * FROM designs WHERE _id = $1;', [designId])
    .then((data: DesignQueryRes) => {
      res.locals.design = data.rows[0];
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught designController.getDesignById middleware error' +
          err,
        message: { err: 'getDesignById: ' + err },
      })
    );
};

export const updateDesignTimestamp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = res.locals;
  let designId: number;
  if (res.locals.designId) designId = res.locals.designId;
  else if (req.params.designId) designId = Number(req.params.designId);
  else if (req.body.designId) designId = req.body.designId;
  else {
    return next({
      log:
        'Express error handler caught designController.updateDesignTimestamp middleware error' +
        'designId not found',
      message: { err: 'updateDesignTimestamp: designId not found' },
    });
  }
  return db
    .query(
      'UPDATE designs SET last_updated = CURRENT_TIMESTAMP, last_updated_by = $2 WHERE _id = $1;',
      [designId, username]
    )
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught designController.updateDesignTimestamp middleware error' +
          err,
        message: { err: 'updateDesignTimestamp: ' + err },
      })
    );
};

export const addCollaborator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const designId: number = Number(req.params.designId);
  const { ownerId, collaboratorUsername, canEdit } = req.body;
  try {
    const collaboratorResponse: { rows: { _id: number }[] } = await db.query(
      'SELECT _id FROM users WHERE username = $1;',
      [collaboratorUsername]
    );
    if (collaboratorResponse.rows.length === 0) {
      return res
        .status(400)
        .send({ message: 'Collaborator username not found' });
    }
    const collaboratorId: number = collaboratorResponse.rows[0]._id;
    await db.query(
      'INSERT INTO collaborators (design_id, collaborator_id, can_edit, is_owner) ' +
        'VALUES ($1, $2, $3, $4);',
      [designId, collaboratorId, canEdit, false]
    );
    const ownerResponse: CollaboratorQueryRes = await db.query(
      'SELECT * FROM collaborators WHERE collaborator_id = $1 AND design_id = $2;',
      [ownerId, designId]
    );
    if (ownerResponse.rows.length === 0) {
      await db.query(
        'INSERT INTO collaborators (design_id, collaborator_id, can_edit, is_owner) ' +
          'VALUES( $1, $2, $3, $4 );',
        [designId, ownerId, true, true]
      );
    }
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught designController.addCollaborator middleware error' +
        err,
      message: { err: 'addCollaborator: ' + err },
    });
  }
};

export default {
  getDesigns,
  deleteDesign,
  addNewDesign,
  updateDesignTitleOrCover,
  getDesignById,
  updateDesignTimestamp,
  addCollaborator,
};
