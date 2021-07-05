import express = require('express');
import { Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { em, EmittableEvents } from '../common';
import { setupGracefulShutdown } from '../util/shutdown';
import { apolloServer } from './graphql';
import {
  checkJwtMiddleware,
  corsMiddleware,
  ignoreFaviconMiddleware,
} from './middleware';
import { conversationsRouter, miscRouter, searchRouter } from './routes';
import { setupNewMessageSubscriber } from '../database/subscribers/new-message.subscriber';
import { getUsernameById } from '../database';

export async function initServer(): Promise<Server> {
  const expressApp = initExpressApp();
  const server = new Server(expressApp);

  setupGracefulShutdown(server);
  setupSocketIO(server);
  await setupNewMessageSubscriber();

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
      origin:
        process.env.NODE_ENV === 'production'
          ? 'https://chat.bigbison.co'
          : 'http://localhost:3000',
      credentials: true,
    },
  });

  io.once('connection', (socket: Socket) => {
    em.on(EmittableEvents.EMIT_MESSAGE_TO_SOCKET, (eventName, payload) => {
      /**
       * @todo Check if headers are valid, like so:
       *
       * if (checkJwt(socket.handshake.headers) === payload.recipient or payload.sender) {
       *   socket.emit(eventname, payload);
       * }
       */
      socket.emit(eventName, payload);
    });
  });

  return io;
}
