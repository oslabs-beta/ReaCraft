const s3 = require('../models/s3Model');

const uploadImage = (req, res, next) => {
  const { userImage } = req.body;
  if (!userImage) return next();
  const base64Data = userImage.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const params = {
    Bucket: 'reactraft',
    Key: `${Date.now()}.png`,
    Body: buffer,
    ContentType: 'image/png',
    ContentEncoding: 'base64',
  };
  return s3
    .upload(params)
    .promise()
    .then((data) => (res.locals.onlineImageUrl = data.Location))
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught imageController.uploadImage middleware error' +
          err,
        message: 'Upload image err: ' + err,
      })
    );
};

const deleteImage = (req, res, next) => {
  const imageToDelete = res.locals.imageToDelete
    ? res.locals.imageToDelete
    : req.body.imageToDelete;
  if (!imageToDelete) return next();
  const params = {
    Bucket: 'reactraft',
    Key: imageToDelete,
  };
  return s3
    .deleteObject(params)
    .promise()
    .then(() => {
      console.log(`File deleted successfully from S3: ${imageToDelete}`);
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught imageController.uploadImage middleware error' +
          err,
        message: 'Upload image err: ' + err,
      })
    );
};

module.exports = { uploadImage, deleteImage };
