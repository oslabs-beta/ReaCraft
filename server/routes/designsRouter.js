const express = require('express');
const router = express.Router();

const imageController = require('../controllers/imageController');
const designController = require('../controllers/designController');
const componentController = require('../controllers/componentController');

router.post(
  '/add',
  imageController.uploadImage,
  designController.addDesign,
  componentController.addComponents,
  (req, res, next) => {
    console.log(res.locals.onlineImageUrl);
    return next();
  },
  (req, res) => res.status(200).send({ design_id: res.locals.designId })
);

router.get('/get', designController.getDesigns, (req, res) =>
  res.status(200).send(res.locals.designs)
);

router.get(
  '/details/:designId',
  componentController.getComponents,
  (req, res) => res.status(200).send(res.locals.components)
);
module.exports = router;
