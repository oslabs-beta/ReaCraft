const db = require('../models/dbModel');

const addNewPage = (req, res, next) => {
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
          'Express error handler caught pageController.addNewPage middleware error' +
          err,
        message: { err: 'addDesign: ' + err },
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

module.exports = { addNewPage, getPages };
