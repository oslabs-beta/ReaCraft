const express = require('express');
const router = express.Router();

const componentController = require('../controllers/componentController');
const rectangleController = require('../controllers/rectangleController');

router.delete(
  '/delete/:componentId',
  componentController.deleteComponentById,
  componentController.shiftComponentsAfterDelete,
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
  (req, res) => res.status(200).send(res.locals.updatedRectangle)
);

router.post(
  '/update-rectangle-style/:componentId',
  rectangleController.updateComponentRectangleStyle,
  (req, res) => res.status(200).send(res.locals.updatedRectangle)
);

router.post(
  '/submit/:componentId',
  componentController.updateComponentForm,
  componentController.updateHtmlForAllSameComponents,
  (req, res) =>
    res.status(200).send({
      updatedComponent: res.locals.updatedComponent,
      pageIdx: res.body.pageIdx,
    })
);

module.exports = router;
