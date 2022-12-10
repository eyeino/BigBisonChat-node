import express = require('express');
import { findUsersWithUsernameLike } from '../../database';
import {
  checkJwtMiddleware,
  corsMiddleware,
  ignoreFaviconMiddleware,
} from '../middleware';

const searchRouter = express.Router();

searchRouter.use(express.json());
searchRouter.use(corsMiddleware);
searchRouter.use(checkJwtMiddleware);
searchRouter.use(ignoreFaviconMiddleware);

searchRouter.get('/users/:query', async (req, res) => {
  const usernameResults = await findUsersWithUsernameLike(req.params.query);
  res.json(usernameResults);
});

export { searchRouter };
