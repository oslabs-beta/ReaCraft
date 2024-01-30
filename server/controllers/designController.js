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

const updateDesignTitleOrCover = (req, res, next) => {
  const { title, imageUrl } = req.body;
  const { designId } = req.params;
  const column = title ? 'title' : 'image_url';
  const value = title || imageUrl;
  return db
    .query(`UPDATE designs SET ${column} = $1 WHERE _id = $2 RETURNING *;`, [
      value,
      designId,
    ])
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
          'Express error handler caught designController.getDesignById middleware error' +
          err,
        message: { err: 'getDesignById: ' + err },
      })
    );
};

const updateDesignTimestamp = (req, res, next) => {
  const { username } = res.locals;
  let designId;
  if (res.locals.designId) designId = res.locals.designId;
  else if (req.params.designId) designId = req.params.designId;
  else if (req.body.designId) designId = req.body.designId;
  else {
    return next({
      log:
        'Express error handler caught designController.updateDesignTimestamp middleware error' +
        'designId not found',
      message: { err: 'updateDesignTimestamp: designId not found' },
    });
  }
  console.log('in updated timestamp, designID', designId, username);
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

const addCollaborator = async (req, res, next) => {
  const { designId } = req.params;
  const { ownerId, collaboratorUsername, canEdit } = req.body;
  try {
    const collaboratorResponse = await db.query(
      'SELECT _id FROM users WHERE username = $1;',
      [collaboratorUsername]
    );
    if (collaboratorResponse.rows.length === 0) {
      return res
        .status(400)
        .send({ message: 'Collaborator username not found' });
    }
    const collaboratorId = collaboratorResponse.rows[0]._id;
    await db.query(
      'INSERT INTO collaborators (design_id, collaborator_id, can_edit, is_owner) ' +
        'VALUES ($1, $2, $3, $4);',
      [designId, collaboratorId, canEdit, false]
    );
    const ownerResponse = await db.query(
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
  } catch (err) {
    return next({
      log:
        'Express error handler caught designController.addCollaborator middleware error' +
        err,
      message: { err: 'addCollaborator: ' + err },
    });
  }
};

const getCollabDesigns = async (req, res, next) => {
  const { userId } = res.locals;
  try {
    const collabResponse = await db.query(
      'SELECT * FROM collaborators WHERE collaborator_id = $1;',
      [userId]
    );
    const designIds = collabResponse.rows.map((row) => row.design_id);
    const designRes = await db.query(
      'SELECT * FROM designs WHERE _id = ANY($1::int[]);',
      [designIds]
    );
    const designs = designRes.rows;
    designs.forEach((design) => {
      const collabRow = collabResponse.rows.find(
        (row) => row.design_id === design._id
      );
      design.canEdit = collabRow.can_edit;
    });
    res.locals.designs = designs;
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught designController.getCollabDesigns middleware error' +
        err,
      message: { err: 'getCollabDesigns: ' + err },
    });
  }
};

module.exports = {
  getDesigns,
  deleteDesign,
  addNewDesign,
  updateDesignTitleOrCover,
  updateDesign,
  getDesignById,
  updateDesignTimestamp,
  addCollaborator,
  getCollabDesigns,
};
