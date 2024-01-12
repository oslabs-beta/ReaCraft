const s3 = require('../models/s3Model');

const uploadImage = (req, res, next) => {
  const { userImage } = req.body;
  const base64Data = userImage.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const uploadParams = {
    Bucket: 'reactraft',
    Key: `${Date.now()}.png`,
    Body: buffer,
    ContentType: 'image/png',
    ContentEncoding: 'base64',
  };
  return s3
    .upload(uploadParams)
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

module.exports = { uploadImage };
