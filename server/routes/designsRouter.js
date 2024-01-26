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
  pageController.addNewPage,
  componentController.createRootComponent,
  rectangleController.createRootRectangle,
  sendDesign
);

router.post(
  '/update-title/:designId',
  designController.updateDesignTitle,
  sendDesign
);

router.post(
  '/update/:designId',
  imageController.deleteImage,
  imageController.uploadImage,
  designController.updateDesign,
  rectangleController.updateRootRectangle,
  sendDesign
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
  '/new-component/:designId',
  componentController.addNewComponent,
  rectangleController.createComponentRectangle,
  (req, res, next) => {
    console.log(res.locals.component);
    return next();
  },
  (req, res) => res.status(200).send(res.locals.component)
);

module.exports = router;
