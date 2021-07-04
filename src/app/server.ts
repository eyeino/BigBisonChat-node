import express = require('express');
import { Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { em } from '../common';
import { setupGracefulShutdown } from '../util/shutdown';
import { apolloServer } from './graphql';
import {
  checkJwtMiddleware,
  corsMiddleware,
  ignoreFaviconMiddleware,
} from './middleware';
import { conversationsRouter, miscRouter, searchRouter } from './routes';

export function initServer(): Server {
  const expressApp = initExpressApp();
  const server = new Server(expressApp);

  setupSocketIO(server);
  setupGracefulShutdown(server);

  return server;
}

function initExpressApp() {
  const app = express();

  app.use(express.json());
  app.use(corsMiddleware);
  app.use(ignoreFaviconMiddleware);

  if (process.env.NODE_ENV === 'production') {
    // Exclude /ping route from authentication
    const excludedRoutes = [/\/((?!ping).)*/];
    app.use(excludedRoutes, checkJwtMiddleware);
  }

  apolloServer.applyMiddleware({ app });

  app.use('/conversations', conversationsRouter);
  app.use('/search', searchRouter);
  app.use('/', miscRouter);

  return app;
}

function setupSocketIO(server: Server) {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.PORT
        ? 'https://chat.bigbison.co'
        : 'http://localhost:3000',
    },
  });

  io.on('connection', (socket: Socket) => {
    em.on('post', (eventName, payload) => {
      socket.emit(eventName, payload);
    });
  });

  return io;
}
