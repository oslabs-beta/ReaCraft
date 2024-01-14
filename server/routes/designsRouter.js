const express = require('express');
const router = express.Router();

const imageController = require('../controllers/imageController');
const designController = require('../controllers/designController');
const componentController = require('../controllers/componentController');
const rectangleController = require('../controllers/rectangleController');

const sendDesign = (req, res) => res.status(200).send(res.locals.design);

const sortComponents = (req, res, next) => {
  res.locals.design.components.sort((a, b) => a.index - b.index);
  return next();
};

router.get('/get', designController.getDesigns, (req, res) =>
  res.status(200).send(res.locals.designs)
);

router.post(
  '/new',
  imageController.uploadImage,
  designController.addNewDesign,
  componentController.createRootComponent,
  rectangleController.createRootRectangle,
  sendDesign
);

router.post(
  '/update/:designId',
  imageController.deleteImage,
  imageController.uploadImage,
  designController.updateDesign,
  sendDesign
);

router.get(
  '/details/:designId',
  designController.getDesignById,
  componentController.getComponents,
  rectangleController.getRectangles,
  sortComponents,
  sendDesign
);

router.delete(
  '/delete/:designId',
  componentController.selectDesignComponentsToDelete,
  rectangleController.deleteDesignRectangles,
  componentController.deleteDesignComponents,
  designController.deleteDesign,
  imageController.deleteImage,
  (req, res) => res.status(200).send({})
);

router.post(
  '/new-component/:designId',
  componentController.addNewComponent,
  rectangleController.createComponentRectangle,
  (req, res) => res.status(200).send(res.locals.component)
);

module.exports = router;
