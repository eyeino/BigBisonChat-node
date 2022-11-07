import express = require('express');
import {
  addUserToRoom,
  createMessage,
  createRoom,
  createUser,
  getMessagesForRoom,
  getRoomById,
  getRoomsForUser,
  getUserBySub,
} from '../../database';
import { decodeJwtFromAuthorizationHeader } from '../../util/jwt';
import {
  checkJwtMiddleware,
  corsMiddleware,
  ignoreFaviconMiddleware,
} from '../middleware';

const roomsRouter = express.Router();

roomsRouter.use(express.json());
roomsRouter.use(corsMiddleware);
// roomsRouter.use(checkJwtMiddleware);
roomsRouter.use(ignoreFaviconMiddleware);

roomsRouter.get('/', async (req, res) => {
  const userInfo = decodeJwtFromAuthorizationHeader(req.headers.authorization);

  const user = await createUser(
    userInfo.sub,
    userInfo.nickname,
    userInfo.picture
  );

  const rooms = await getRoomsForUser(user);

  res.json(rooms);
});

// get list of messages between two users
roomsRouter.get('/:roomId', async (req, res) => {
  const userInfo = decodeJwtFromAuthorizationHeader(req.headers.authorization);
  const user = await getUserBySub(userInfo.sub);
  const room = await getRoomById(req.params.roomId);

  // TODO: verify user is allowed to see room's messages (is in the room)

  if (!room) {
    res.status(404).end();
    return;
  }

  const messages = await getMessagesForRoom(room);
  res.json(messages);
});

// create room
roomsRouter.post('/', async (req, res) => {
  const userInfo = decodeJwtFromAuthorizationHeader(req.headers.authorization);
  const user = await getUserBySub(userInfo.sub);
  const room = await createRoom();

  if (!room) {
    res.sendStatus(400);
    return;
  }

  if (!user) {
    res.sendStatus(400);
    return;
  }

  await addUserToRoom(user, room);

  res.sendStatus(200);
});

// send message to a user from a user
roomsRouter.post('/:roomId', async (req, res) => {
  try {
    const userInfo = decodeJwtFromAuthorizationHeader(
      req.headers.authorization
    );

    const user = await getUserBySub(userInfo.sub);
    const room = await getRoomById(req.params.roomId);
    const messageBody = req.body.messageBody;

    if (!room) {
      res.sendStatus(400);
      return;
    }

    if (!user) {
      res.sendStatus(400);
      return;
    }

    await createMessage(messageBody, user, room);

    res.sendStatus(200);
    return;
  } catch (err) {
    res.sendStatus(400);
    return;
  }
});

export { roomsRouter };
