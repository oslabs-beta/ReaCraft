const express = require('express');
const router = express.Router();

const componentController = require('../controllers/componentController');
const rectangleController = require('../controllers/rectangleController');

router.delete(
  '/delete/:componentId',
  rectangleController.deleteComponentRectangle,
  componentController.deleteComponentById,
  componentController.shiftComponentsAfterDelete,
  (req, res) =>
    res.status(200).send({
      shifted: res.locals.shiftedIndices,
      indexDeleted: res.locals.indexDeleted,
    })
);

router.post(
  '/update-parent/:componentId',
  componentController.updateParentOrTag,
  componentController.resetParentHtml,
  (req, res) => res.status(200).send(res.locals)
);

router.post(
  '/update-tag/:componentId',
  componentController.updateParentOrTag,
  (req, res) => res.status(200).send(res.locals)
);

router.post(
  '/submit/:componentId',
  componentController.updateComponentForm,
  (req, res) => res.status(200).send(res.locals.updatedComponent)
);

module.exports = router;
