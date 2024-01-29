const s3 = require('../models/s3Model');
const websocketController = require ('./websocketController');
const WebSocket = require('ws');

const uploadImage = (req, res, next) => {
  // const { userImage } = req.body;
  console.log('hit uploadImage');
  const { userImage, clientId } = req.body;
  console.log('this is the clientId from req.body', clientId);
  if (!userImage) return next();
  if (!clientId) return res.status(404).send('clientId is required');

  const ws = websocketController.getClient(clientId);
  console.log('this is ws from uploadImage', ws);
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return res.status(404).send('websocket client not found');
  }

  const base64Data = userImage.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const params = {
    Bucket: 'reactraft',
    Key: `${Date.now()}.png`,
    Body: buffer,
    ContentType: 'image/png',
    ContentEncoding: 'base64',
  };

  const upload = s3.upload(params);
  
  upload.on('httpUploadProgress', function(evt) {
    console.log('getting upload progress');
    const progress = Math.round((evt.loaded / evt.total) * 100);
    console.log('this is the progress', progress);

    if (ws.readyState === 1) {
      ws.send(JSON.stringify({ type: 'progressUpdate', progress: progress }));
      console.log('progress update sent to client', clientId);
    } else {
      console.log('websocket not open or does not exist for client', clientId);
    }
  });
  upload.promise()
  .then(data => {
    res.locals.onlineImageUrl = data.Location;
    next();
  })
  .catch(err => {
    next({
      log: `Express error handler caught imageController.uploadImage middleware error: ${err}`,
      message: `Upload image err: ${err}`,
    })
  })
};

const deleteImage = (req, res, next) => {
  let imageToDelete = res.locals.imageToDelete
    ? res.locals.imageToDelete
    : req.body.imageToDelete;
  if (!imageToDelete) return next();
  imageToDelete = Array.isArray(imageToDelete)
    ? imageToDelete
    : [imageToDelete];
  const params = {
    Bucket: 'reactraft',
    Delete: {
      Objects: imageToDelete.map((Key) => ({ Key })),
      Quiet: false,
    },
  };
  return s3
    .deleteObjects(params)
    .promise()
    .then((response) => {
      console.log('Files deleted successfully from S3:', response.Deleted);
      return next();
    })
    .catch((err) =>
      next({
        log:
          'Express error handler caught imageController.deleteImage middleware error: ' +
          err,
        message: 'deleteImage: ' + err,
      })
    );
};

module.exports = { uploadImage, deleteImage };
