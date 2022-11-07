import express = require('express');
import { Server } from 'http';
import { setupGracefulShutdown } from '../util/shutdown';
import { conversationsRouter, miscRouter, searchRouter } from './routes';

export async function initServer(): Promise<Server> {
  const expressApp = initExpressApp();
  const server = new Server(expressApp);

  setupGracefulShutdown(server);
  // setupSocketIO(server);
  // await setupNewMessageSubscriber();

  return server;
}

function initExpressApp() {
  const app = express();

  app.use('/conversations', conversationsRouter);
  app.use('/search', searchRouter);
  app.use('/', miscRouter);

  return app;
}
