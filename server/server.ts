import express, { Request, Response, NextFunction } from 'express';
import { DefaultError } from '../docs/types';
import { createServer } from 'http';
import { setupWebSocketServer } from './controllers/websocketController';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

import router from './routes/router';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Create HTTP server and pass express app to it
const server = createServer(app);

// Setup WebSocket server on the same HTTP server
setupWebSocketServer(server);

const PROJECT_ROOT = process.env.PROJECT_ROOT;
app.use(express.static(path.join(PROJECT_ROOT, '/client/public')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true })); // If you want to parse URL-encoded bodies
app.use(cookieParser());

// session setup
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  // options forces the session to be saved back to the session store, setting this to 'false' can help reduce session concurrency issues
  resave: false,
  // setting saveUnitialized to false will only store sessions on the server for users who are logged in
  saveUninitialized: false,
  // cookie option in session middleware defines the settings for the session cookie - creates its own cookie 'connect.sid' to track the session. specifically for maintaining the session state and contains the session ID which is matached on the server with a stored session main state between HTTP requests
  cookie: { secure: false },
}));
// passport initialization 
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: 'http://localhost:3000', // Allow the React app to make requests
    credentials: true, // Allow cookies to be sent
  })
);

// Logging the request method and endpoint
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} request for '${req.url}'`);
  return next();
});

app.use('/', router);

// 404 Error Handler
app.get('*', (req: Request, res: Response) =>
  res.status(404).send('Page not found')
);

// Global Error Handler
app.use(
  (err: DefaultError, req: Request, res: Response, next: NextFunction) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error' + err,
      status: 500,
      message: { err: 'An error occurred' + err },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  }
);

// Start the HTTP server on the port
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
