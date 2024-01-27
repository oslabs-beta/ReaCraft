import express, { Request, Response, NextFunction } from 'express';
import { DefaultError } from '../docs/types';
import * as http from 'http';
// import { WebSocketServer, Server as WebsocketServer } from 'ws';
import { WebSocketServer } from 'ws';
import * as url from 'url';

require('dotenv').config();

const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

const router = require('./routes/router');

// initialize a http server instance to attach both Express and WebSocket servers
const server = http.createServer(app);

// initialize the websocket server instance. takes the HTTP server instance created as an option, indicating that WebSocket connections will be handled by the same server
const wss = new WebSocketServer({ server });

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

let clients = new Map();

// handle websocket connection
wss.on('connection', (ws, req) => {
  // retrieve clientId from the request URL
  const queryParams = url.parse(req.url, true).query;
  const clientId = queryParams.clientId;
  console.log('this is the clientId from wss.on', clientId);

  if (clientId) {
    clients.set(clientId, ws);
    console.log('client connected with ID', clientId);
  } else {
    console.log('Client connected without an ID');
  }

  ws.on('message', (data) => {
    let message;
    try {
      message = JSON.parse(data.toString());
    } catch (e) {
      console.error('Error parsing message', e);
      return;
    }

    const { action, data: messageData } = message;
    console.log(`received action: ${action}`, messageData);
  });

  ws.on('close', () => {
    clients.delete(clientId);
    console.log('client disconnected');
  });
});

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

// app.listen(PORT, () => {
//   console.log(`Server listening on port: ${PORT}...`);
// });


server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
