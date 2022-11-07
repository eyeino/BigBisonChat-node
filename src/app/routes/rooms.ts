import express = require('express');
import {
  addUserToRoom,
  createMessage,
  upsertRoom,
  createUser,
  getIsUserInRoom,
  getMessagesForRoom,
  getRoomById,
  getRoomsForUser,
  getUserById,
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

// get list of messages in room
roomsRouter.get('/:roomId', async (req, res) => {
  const userInfo = decodeJwtFromAuthorizationHeader(req.headers.authorization);
  const user = await getUserBySub(userInfo.sub);
  const room = await getRoomById(req.params.roomId);

  if (!user) {
    res.status(400).end();
    return;
  }

  if (!room) {
    res.status(404).end();
    return;
  }

  const isUserInRoom = await getIsUserInRoom(user, room);

  if (!isUserInRoom) {
    res.status(403).end();
    return;
  }

  const messages = await getMessagesForRoom(room);
  res.json(messages);
});

// create room
roomsRouter.post('/', async (req, res) => {
  const userInfo = decodeJwtFromAuthorizationHeader(req.headers.authorization);
  const user = await getUserBySub(userInfo.sub);
  const room = await upsertRoom();

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

// send message to room
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

// add user to room
roomsRouter.put('/:roomId', async (req, res) => {
  try {
    const userInfo = decodeJwtFromAuthorizationHeader(
      req.headers.authorization
    );

    const user = await getUserBySub(userInfo.sub);
    const room = await getRoomById(req.params.roomId);
    const userIdToAdd = req.body.userIdToAdd;

    if (!room) {
      res.sendStatus(400);
      return;
    }

    if (!user) {
      res.sendStatus(400);
      return;
    }

    const isUserInRoom = await getIsUserInRoom(user, room);

    if (!isUserInRoom) {
      res.status(403).end();
      return;
    }

    const userToAdd = await getUserById(userIdToAdd);

    if (!userToAdd) {
      res.sendStatus(400);
      return;
    }

    const isUserToAddAlreadyInRoom = await getIsUserInRoom(userToAdd, room);

    if (isUserToAddAlreadyInRoom) {
      res.status(409).end();
      return;
    }

    await addUserToRoom(userToAdd, room);

    res.sendStatus(200);
    return;
  } catch (err) {
    res.sendStatus(400);
    return;
  }
});

// update room name
roomsRouter.patch('/:roomId', async (req, res) => {
  try {
    const userInfo = decodeJwtFromAuthorizationHeader(
      req.headers.authorization
    );

    const user = await getUserBySub(userInfo.sub);
    const room = await getRoomById(req.params.roomId);
    const name = req.body.name;

    if (!room) {
      res.sendStatus(400);
      return;
    }

    if (!user) {
      res.sendStatus(400);
      return;
    }

    const isUserInRoom = await getIsUserInRoom(user, room);

    if (!isUserInRoom) {
      res.status(403).end();
      return;
    }

    await upsertRoom(name, room);

    res.sendStatus(200);
    return;
  } catch (err) {
    res.sendStatus(400);
    return;
  }
});

export { roomsRouter };
