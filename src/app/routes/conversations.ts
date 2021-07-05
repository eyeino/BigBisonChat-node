import express = require('express');
import { em } from '../../common';
import {
  getConversation,
  getConversations,
  getUserId,
  makeUser,
  sendMessage,
} from '../../database';
import {
  decodeJwtFromAuthorizationHeader,
  determineEventNameFromUsernames,
} from '../../util/jwt';

const conversationsRouter = express.Router();

conversationsRouter.get('/', async (req, res) => {
  const userInfo = decodeJwtFromAuthorizationHeader(req.headers.authorization);

  try {
    await makeUser(userInfo.username, userInfo.sub, userInfo.picture);
    const userId = await getUserId(userInfo.username);
    const conversations = await getConversations(userId);

    res.json(conversations);
  } catch (err) {
    await makeUser(
      userInfo.username,
      userInfo.sub,
      userInfo.picture
    ).catch((err) => console.log(err));
    res.redirect(req.originalUrl);
  }
});

// get list of messages between two users
conversationsRouter.get('/:username', async (req, res) => {
  const userInfo = decodeJwtFromAuthorizationHeader(req.headers.authorization);
  const userId = await getUserId(userInfo.username);

  const otherUserId = await getUserId(req.params.username);

  const messages = await getConversation(userId, otherUserId, req.query.offset);
  res.json(messages);
});

// send message to a user from a user
conversationsRouter.post('/:username', async (req, res) => {
  try {
    const userInfo = decodeJwtFromAuthorizationHeader(
      req.headers.authorization
    );

    const userId = await getUserId(userInfo.username);
    const otherUserId = await getUserId(req.params.username);
    const messageBody = req.body.messageBody;

    const insertedMessage = await sendMessage(userId, otherUserId, messageBody);

    const eventName = determineEventNameFromUsernames(
      userInfo.username,
      req.params.username
    );

    em.emit('post', eventName, insertedMessage);

    res.sendStatus(200);
    return;
  } catch (err) {
    res.sendStatus(400);
    return;
  }
});

export { conversationsRouter };
