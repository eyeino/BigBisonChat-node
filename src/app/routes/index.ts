import express = require('express');

import { conversationsRouter } from './conversations';
import { searchRouter } from './search';

const miscRouter = express.Router();

miscRouter.get('/ping', (_req, res) => {
  res.sendStatus(200);
});

miscRouter.get('*', (_req, res) => {
  res.sendStatus(404);
});

export { miscRouter, conversationsRouter, searchRouter };
