import express = require('express');
import {
  getConversation,
  getConversations,
  getUserBySub,
  getUserByUsername,
  upsertUser,
  createMessage,
} from '../../database';
import { decodeJwtFromAuthorizationHeader } from '../../util/jwt';
import {
  checkJwtMiddleware,
  corsMiddleware,
  ignoreFaviconMiddleware,
} from '../middleware';

const conversationsRouter = express.Router();

conversationsRouter.use(express.json());
conversationsRouter.use(corsMiddleware);
conversationsRouter.use(checkJwtMiddleware);
conversationsRouter.use(ignoreFaviconMiddleware);

conversationsRouter.get('/', async (req, res) => {
  const userInfo = decodeJwtFromAuthorizationHeader(req.headers.authorization);

  const user = await upsertUser(
    userInfo.sub,
    userInfo.nickname,
    userInfo.picture
  );
  const conversations = await getConversations(Number(user.user_id));

  res.json(conversations);
});

// get list of messages between two users
conversationsRouter.get('/:username', async (req, res) => {
  const userInfo = decodeJwtFromAuthorizationHeader(req.headers.authorization);
  const user = await getUserBySub(userInfo.sub);
  const otherUser = await getUserByUsername(req.params.username);

  const messages = await getConversation(
    Number(user?.user_id),
    Number(otherUser?.user_id)
  );
  res.json(messages);
});

// send message to a user from a user
conversationsRouter.post('/:username', async (req, res) => {
  try {
    const userInfo = decodeJwtFromAuthorizationHeader(
      req.headers.authorization
    );

    const user = await getUserBySub(userInfo.sub);
    const otherUser = await getUserByUsername(req.params.username);
    const messageBody = req.body.messageBody;

    await createMessage(
      Number(user?.user_id),
      Number(otherUser?.user_id),
      messageBody
    );

    res.sendStatus(200);
    return;
  } catch (err) {
    res.sendStatus(400);
    return;
  }
});

export { conversationsRouter };
