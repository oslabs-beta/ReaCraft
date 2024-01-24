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
    filesData,
    title,
  }: {
    filesData: { filename: string; content: string }[];
    title: string;
  } = req.body;
  const projectPath = path.join(__dirname, '../boilerplate');
  const componentPath = path.join(projectPath, './src/components');

  try {
    if (!fs.existsSync(componentPath)) {
      fs.mkdirSync(componentPath);
    }
    filesData.forEach((file) => {
      fs.writeFileSync(path.join(componentPath, file.filename), file.content);
    });
    res.attachment(`${title}.zip`);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);
    archive.directory(projectPath, false);
    await archive.finalize();
    rimraf.sync(componentPath);
  } catch (err) {
    next({
      log:
        'Express error handler caught fileController.downloadFiles middleware error' +
        err,
      message: { err: 'downloadFiles: ' + err },
    });
  }
};

export { downloadFiles };
