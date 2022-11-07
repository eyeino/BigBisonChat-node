import express = require('express');
import {
  checkJwtMiddleware,
  corsMiddleware,
  ignoreFaviconMiddleware,
} from '../middleware';

import { roomsRouter } from './rooms';
import { searchRouter } from './search';

const miscRouter = express.Router();

miscRouter.use(express.json());
miscRouter.use(corsMiddleware);
miscRouter.use(ignoreFaviconMiddleware);

if (process.env.NODE_ENV === 'production') {
  // Exclude /ping route from authentication
  const excludedRoutes = [/\/((?!ping).)*/];
  miscRouter.use(excludedRoutes, checkJwtMiddleware);
}

miscRouter.get('/ping', (_req, res) => {
  res.sendStatus(200);
});

miscRouter.get('*', (_req, res) => {
  res.sendStatus(404);
});

export { miscRouter, roomsRouter, searchRouter };
