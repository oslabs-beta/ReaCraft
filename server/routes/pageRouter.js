const express = require('express');
const router = express.Router();

const imageController = require('../controllers/imageController');
const componentController = require('../controllers/componentController');
const rectangleController = require('../controllers/rectangleController');
const pageController = require('../controllers/pageController');
const designController = require('../controllers/designController');

router.post(
  '/new-component/:pageId',
  componentController.addNewComponent,
  rectangleController.createComponentRectangle,
  pageController.getDesignId,
  designController.updateDesignTimestamp,
  (req, res, next) => {
    console.log(res.locals.component);
    return next();
  },
  (req, res) => res.status(200).send(res.locals.component)
);

router.delete(
  '/delete/:pageId',
  pageController.deletePageById,
  pageController.shiftPages,
  componentController.updateRootComponentNameForShiftedPages,
  designController.updateDesignTimestamp,
  (req, res) =>
    res.status(200).send({
      shifted: res.locals.shiftedIndices,
      indexDeleted: res.locals.indexDeleted,
    })
);

module.exports = router;
