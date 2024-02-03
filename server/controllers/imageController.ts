import s3 from '../models/s3Model';
import { getClient } from './websocketController';
import WebSocket from 'ws';
import { Request, Response, NextFunction } from 'express';
import { S3 } from 'aws-sdk';

export const uploadNewDesignImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userImage, clientId, test } = req.body;

  if (!userImage) return next();

  let skipWebSocket = req.originalUrl === '/update-profile' || test;

  let ws: WebSocket | null = null;
  if (!skipWebSocket) {
    if (!clientId)
      return next({
        status: 404,
        log: `Express error handler caught imageController.uploadNewDesignImage middleware error: clientId required`,
        message: `Upload image err: clientId is required`,
      });
    ws = getClient(clientId) as WebSocket;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return next({
        status: 404,
        log: `Express error handler caught imageController.uploadNewDesignImage middleware error: websocket client not found`,
        message: `Upload image err: websocket client not found`,
      });
    }
  }

  const base64Data = userImage.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const params: S3.PutObjectRequest = {
    Bucket: 'reactraft',
    Key: `${Date.now()}.png`,
    Body: buffer,
    ContentType: 'image/png',
    ContentEncoding: 'base64',
  };

  const upload = s3.upload(params);

  upload.on('httpUploadProgress', function (evt) {
    const progress = Math.round((evt.loaded / evt.total) * 100);

    if (!skipWebSocket && ws && ws.readyState === 1) {
      ws.send(JSON.stringify({ type: 'progressUpdate', progress: progress }));

      if (progress === 100) {
        ws.send(JSON.stringify({ type: 'uploadComplete', progress: progress }));
      }
    }
  });

  upload
    .promise()
    .then((data) => {
      res.locals.onlineImageUrl = data.Location;
      next();
    })
    .catch((err) => {
      next({
        log: `Express error handler caught imageController.uploadImage middleware error: ${err}`,
        message: `Upload image err: ${err}`,
      });
    });
};

export const uploadImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userImage } = req.body;
  if (!userImage) return next();

  const base64Data = userImage.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const params: S3.PutObjectRequest = {
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

export const deleteImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let imageToDelete = res.locals.imageToDelete
    ? res.locals.imageToDelete
    : req.body.imageToDelete;

  if (!imageToDelete) return next();

  imageToDelete = Array.isArray(imageToDelete)
    ? imageToDelete
    : [imageToDelete];

  const params: S3.DeleteObjectsRequest = {
    Bucket: 'reactraft',
      Delete: {
        Objects: imageToDelete.map((Key: string): { Key: string } => ({ Key })),
        Quiet: false,
      }
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
