import express = require('express');
import { Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { em, EmittableEvents } from '../common';
import { setupGracefulShutdown } from '../util/shutdown';
import { conversationsRouter, miscRouter, searchRouter } from './routes';
import {
  MessagePayload,
  setupNewMessageSubscriber,
} from '../database/subscribers/new-message.subscriber';
import { decodeJwtFromAuthorizationHeader } from '../util/jwt';

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

  /**
   * @todo Add back in when frontend uses GraphQL.
   */
  // apolloServer.applyMiddleware({ app });

  app.use('/conversations', conversationsRouter);
  app.use('/search', searchRouter);
  app.use('/', miscRouter);

  return app;
}

export function setupSocketIO(server: Server): SocketServer {
  const io = new SocketServer(server, {
    cors: {
      origin:
        process.env.NODE_ENV === 'production'
          ? 'https://chat.bigbison.co'
          : 'http://localhost:3000',
    },
  });

  io.on('connection', (socket: Socket) => {
    em.on(
      EmittableEvents.EMIT_MESSAGE_TO_SOCKET,
      (
        eventName: string,
        payload: MessagePayload & {
          recipient_username: string;
          sender_username: string;
        }
      ) => {
        try {
          const { nickname } = decodeJwtFromAuthorizationHeader(
            socket.handshake.auth.token ?? ''
          );

          if (
            [payload.recipient_username, payload.sender_username].includes(
              nickname
            )
          ) {
            socket.emit(eventName, payload);
          }
        } catch (error) {
          console.log(error);
        }
      }
    );
  });

  io.allSockets();

  return io;
}
