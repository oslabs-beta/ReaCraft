import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
const rimraf = require('rimraf');
import { Request, Response, NextFunction } from 'express';

const downloadFiles = async (
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
  const projectPath = path.join(__dirname, '../boilerplate');
  const projectSrcPath = path.join(projectPath, './src');

  try {
    fs.writeFileSync(
      path.join(projectSrcPath, appData.filename),
      appData.content
    );

    Object.keys(pagesData).forEach((pageName) => {
      const pagePath = path.join(projectSrcPath, `./${pageName}`);
      if (!fs.existsSync(pagePath)) fs.mkdirSync(pagePath);
      pagesData[pageName].forEach((file) =>
        fs.writeFileSync(path.join(pagePath, file.filename), file.content)
      );
    });

    res.attachment(`${title}.zip`);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);
    archive.directory(projectPath, false);

    await new Promise((resolve, reject) => {
      archive.on('end', resolve);
      archive.on('error', reject);
      archive.finalize();
    });

    const deletePath = (path: string) => {
      return new Promise<void>((resolve, reject) => {
        rimraf(path, (err: any) => {
          if (err) {
            console.error(`Error deleting ${path}:`, err);
            reject(err);
          } else {
            console.log(`Successfully deleted ${path}`);
            resolve();
          }
        });
      });
    };

    // Delete appData file
    await deletePath(path.join(projectSrcPath, appData.filename));

    // Delete pagesData files and directories
    for (const pageName of Object.keys(pagesData)) {
      const pagePath = path.join(projectSrcPath, `./${pageName}`);
      await deletePath(pagePath);
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

export { downloadFiles };
