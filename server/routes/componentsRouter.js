const express = require('express');
const router = express.Router();

const componentController = require('../controllers/componentController');
const rectangleController = require('../controllers/rectangleController');
const designController = require('../controllers/designController');
const pageController = require('../controllers/pageController');

router.delete(
  '/delete/:componentId',
  componentController.deleteComponentById,
  componentController.shiftComponentsAfterDelete,
  pageController.getDesignId,
  designController.updateDesignTimestamp,
  (req, res) =>
    res.status(200).send({
      shifted: res.locals.shiftedIndices,
      indexDeleted: res.locals.indexDeleted,
      pageId: res.locals.pageId,
    })
);

router.post(
  '/update-parent/:componentId',
  componentController.updateParent,
  componentController.updateHtmlForAllSameComponents,
  pageController.getDesignId,
  designController.updateDesignTimestamp,
  (req, res) =>
    res.status(200).send({
      ...req.body,
      componentId: req.params.componentId,
      parentName: res.locals.componentName,
    })
);

router.post(
  '/update-position/:componentId',
  rectangleController.updateComponentRectanglePosition,
  componentController.getPageId,
  pageController.getDesignId,
  designController.updateDesignTimestamp,
  (req, res) =>
    res.status(200).send({
      updatedRectangle: res.locals.updatedRectangle,
      pageIdx: req.body.pageIdx,
    })
);

router.post(
  '/update-rectangle-style/:componentId',
  rectangleController.updateComponentRectangleStyle,
  componentController.getPageId,
  pageController.getDesignId,
  designController.updateDesignTimestamp,
  (req, res) =>
    res.status(200).send({
      updatedRectangle: res.locals.updatedRectangle,
      pageIdx: req.body.pageIdx,
    })
);

router.post(
  '/submit/:componentId',
  componentController.updateComponentForm,
  componentController.updateHtmlForAllSameComponents,
  pageController.getDesignId,
  designController.updateDesignTimestamp,
  (req, res) =>
    res.status(200).send({
      updatedComponent: res.locals.updatedComponent,
      pageIdx: req.body.pageIdx,
    })
);

module.exports = router;
