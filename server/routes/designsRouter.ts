import express, { Request, Response } from 'express';
import { uploadImage, deleteImage } from '../controllers/imageController';
import {
  getDesigns,
  sortComponents,
  addNewDesign,
  updateDesignTitleOrCover,
  updateDesignTimestamp,
  getDesignById,
  deleteDesign,
  addCollaborator,
} from '../controllers/designController';
import {
  createPageForNewDesign,
  getPages,
  addNewPage,
  shiftPages,
} from '../controllers/pageController';
import {
  createRootComponent,
  updateRootComponentNameForShiftedPages,
  getComponents,
} from '../controllers/componentController';
import {
  createRootRectangle,
  getRectangles,
} from '../controllers/rectangleController';

const sendDesign = (req: Request, res: Response) =>
  res.status(200).send(res.locals.design);

const router = express.Router();

router.get('/get', getDesigns, (req: Request, res: Response) =>
  res.status(200).send(res.locals.designs)
);

router.post(
  '/new',
  uploadImage,
  addNewDesign,
  createPageForNewDesign,
  createRootComponent,
  createRootRectangle,
  sendDesign
);

router.post(
  '/update/:designId',
  updateDesignTitleOrCover,
  updateDesignTimestamp,
  (req: Request, res: Response) => {
    res.status(200).send({ message: 'updated design successfully' });
  }
);

router.get(
  '/details/:designId',
  getDesignById,
  getPages,
  getComponents,
  getRectangles,
  sortComponents,
  sendDesign
);

router.delete(
  '/delete/:designId',
  deleteDesign,
  deleteImage,
  (req: Request, res: Response) =>
    res.status(200).send({ message: 'deleted design successfully' })
);

router.post(
  '/add-collaborator/:designId',
  addCollaborator,
  updateDesignTimestamp,
  (req: Request, res: Response) =>
    res.status(200).send({ message: 'added collaborator successfully' })
);

router.post(
  '/new-page/:designId',
  uploadImage,
  addNewPage,
  shiftPages,
  createRootComponent,
  updateRootComponentNameForShiftedPages,
  createRootRectangle,
  updateDesignTimestamp,
  (req: Request, res: Response) =>
    res
      .status(200)
      .send({ newPage: res.locals.newPage, shifted: res.locals.shiftedIndices })
);

export default router;
