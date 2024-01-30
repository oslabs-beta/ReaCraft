import express, { Request, Response } from 'express';

import {
  deleteComponentById,
  shiftComponentsAfterDelete,
  updateParent,
  updateHtmlForAllSameComponents,
  getPageId,
  updateComponentForm,
} from '../controllers/componentController';

import { getDesignId } from '../controllers/pageController';
import { updateDesignTimestamp } from '../controllers/designController';

import {
  updateComponentRectanglePosition,
  updateComponentRectangleStyle,
} from '../controllers/rectangleController';

const router = express.Router();

router.delete(
  '/delete/:componentId',
  deleteComponentById,
  shiftComponentsAfterDelete,
  getDesignId,
  updateDesignTimestamp,
  (req: Request, res: Response) =>
    res.status(200).send({
      shifted: res.locals.shiftedIndices,
      indexDeleted: res.locals.indexDeleted,
      pageId: res.locals.pageId,
    })
);

router.post(
  '/update-parent/:componentId',
  updateParent,
  updateHtmlForAllSameComponents,
  getDesignId,
  updateDesignTimestamp,
  (req: Request, res: Response) =>
    res.status(200).send({
      ...req.body,
      componentId: req.params.componentId,
      parentName: res.locals.componentName,
    })
);

router.post(
  '/update-position/:componentId',
  updateComponentRectanglePosition,
  getPageId,
  getDesignId,
  updateDesignTimestamp,
  (req: Request, res: Response) =>
    res.status(200).send({
      updatedRectangle: res.locals.updatedRectangle,
      pageIdx: req.body.pageIdx,
    })
);

router.post(
  '/update-rectangle-style/:componentId',
  updateComponentRectangleStyle,
  getPageId,
  getDesignId,
  updateDesignTimestamp,
  (req: Request, res: Response) =>
    res.status(200).send({
      updatedRectangle: res.locals.updatedRectangle,
      pageIdx: req.body.pageIdx,
    })
);

router.post(
  '/submit/:componentId',
  updateComponentForm,
  updateHtmlForAllSameComponents,
  getDesignId,
  updateDesignTimestamp,
  (req: Request, res: Response) =>
    res.status(200).send({
      updatedComponent: res.locals.updatedComponent,
      pageIdx: req.body.pageIdx,
    })
);

export default router;
