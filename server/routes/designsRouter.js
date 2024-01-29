const express = require('express');
const router = express.Router();

const imageController = require('../controllers/imageController');
const designController = require('../controllers/designController');
const componentController = require('../controllers/componentController');
const rectangleController = require('../controllers/rectangleController');
const pageController = require('../controllers/pageController');

const sendDesign = (req, res) => res.status(200).send(res.locals.design);

const sortComponents = (req, res, next) => {
  res.locals.design.pages.sort((a, b) => a.index - b.index);
  res.locals.design.pages.forEach((page) => {
    page.components.sort((a, b) => a.index - b.index);
  });

  return next();
};

router.get('/get', designController.getDesigns, (req, res) =>
  res.status(200).send(res.locals.designs)
);

router.post(
  '/new',
  imageController.uploadImage,
  designController.addNewDesign,
  pageController.createPageForNewDesign,
  componentController.createRootComponent,
  rectangleController.createRootRectangle,
  sendDesign
);

router.post(
  '/update/:designId',
  designController.updateDesignTitleOrCover,
  designController.updateDesignTimestamp,
  (req, res) => {
    res.status(200).send({ message: 'updated design successfully' });
  }
);

router.get(
  '/details/:designId',
  designController.getDesignById,
  pageController.getPages,
  componentController.getComponents,
  rectangleController.getRectangles,
  sortComponents,
  sendDesign
);

router.delete(
  '/delete/:designId',
  designController.deleteDesign,
  imageController.deleteImage,
  (req, res) => res.status(200).send({ message: 'deleted design successfully' })
);

router.post(
  '/add-collaborator/:designId',
  designController.addCollaborator,
  designController.updateDesignTimestamp,
  (req, res) =>
    res.status(200).send({ message: 'added collaborator successfully' })
);

router.post(
  '/new-page/:designId',
  imageController.uploadImage,
  pageController.addNewPage,
  pageController.shiftPages,
  componentController.createRootComponent,
  componentController.updateRootComponentNameForShiftedPages,
  rectangleController.createRootRectangle,
  designController.updateDesignTimestamp,
  (req, res) =>
    res
      .status(200)
      .send({ newPage: res.locals.newPage, shifted: res.locals.shiftedIndices })
);

router.get('/get-collab', designController.getCollabDesigns, (req, res) =>
  res.status(200).send(res.locals.designs)
);

module.exports = router;
