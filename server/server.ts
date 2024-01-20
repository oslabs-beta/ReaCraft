import express, { Request, Response, NextFunction } from 'express';
import { DefaultError } from '../docs/types';
require('dotenv').config();

const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

const router = require('./routes/router');

app.use(express.static(path.resolve(__dirname, '../client/public')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000', // Allow the React app to make requests
    credentials: true, // Allow cookies to be sent
  })
);

//Logging the request method and endpoint
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} request for '${req.url}'`);
  return next();
});

app.use('/', router);

//404 Error Handler
app.get('*', (req: Request, res: Response) =>
  res.status(404).send('Page not found')
);

//Global Error Handler
app.use(
  (err: DefaultError, req: Request, res: Response, next: NextFunction) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error' + err,
      status: 500,
      message: { err: 'An error occurred' + err },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj);
    return res.status(errorObj.status).json(errorObj.message);
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
