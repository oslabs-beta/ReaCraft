import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
const rimraf = require('rimraf');
import { Request, Response, NextFunction } from 'express';

import dotenv from 'dotenv';
dotenv.config();

export const downloadFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    pagesData,
    appData,
    title,
  }: {
    pagesData: { [key: string]: { filename: string; content: string }[] };
    appData: { filename: string; content: string };
    title: string;
  } = req.body;

  const PROJECT_ROOT = process.env.PROJECT_ROOT;
  const projectPath = path.join(PROJECT_ROOT, 'server/boilerplate');
  const projectSrcPath = path.join(projectPath, './src');

  try {
    fs.writeFileSync(
      path.join(projectSrcPath, appData.filename),
      appData.content
    );
    const pagePaths: string[] = [];
    Object.keys(pagesData).forEach((pageName) => {
      const pagePath = path.join(projectSrcPath, `./${pageName}`);
      pagePaths.push(pagePath);
      if (!fs.existsSync(pagePath)) fs.mkdirSync(pagePath);
      pagesData[pageName].forEach((file) =>
        fs.writeFileSync(path.join(pagePath, file.filename), file.content)
      );
    });

    res.attachment(`${title}.zip`);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);
    archive.directory(projectPath, false);
    await archive.finalize();

    fs.unlinkSync(path.join(projectSrcPath, appData.filename));
    for (const pagePath of pagePaths) {
      rimraf.sync(pagePath);
    }
  } catch (err) {
    return next({
      log:
        'Express error handler caught fileController.downloadFiles middleware error: ' +
        err,
      message: { err: 'downloadFiles: ' + err },
    });
  }
};
