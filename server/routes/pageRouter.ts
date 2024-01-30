import express, { Request, Response } from 'express';
import {
  addNewComponent,
  updateRootComponentNameForShiftedPages,
} from '../controllers/componentController';
import { createComponentRectangle } from '../controllers/rectangleController';
import {
  getDesignId,
  deletePageById,
  shiftPages,
} from '../controllers/pageController';
import { updateDesignTimestamp } from '../controllers/designController';

const router = express.Router();

router.post(
  '/new-component/:pageId',
  addNewComponent,
  createComponentRectangle,
  getDesignId,
  updateDesignTimestamp,
  (req: Request, res: Response) => res.status(200).send(res.locals.component)
);

router.delete(
  '/delete/:pageId',
  deletePageById,
  shiftPages,
  updateRootComponentNameForShiftedPages,
  updateDesignTimestamp,
  (req: Request, res: Response) =>
    res.status(200).send({
      shifted: res.locals.shiftedIndices,
      indexDeleted: res.locals.indexDeleted,
    })
);

export default router;
