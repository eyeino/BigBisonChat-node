import { PrismaClient, Message, User, Room } from '@prisma/client';

const prisma = new PrismaClient();

export const getRoomsForUser = async (user: User): Promise<Room[]> => {
  return await prisma.room.findMany({
    where: {
      members: {
        some: {
          id: {
            equals: user.id,
          },
        },
      },
    },
  });
};

export const getMessagesForRoom = async (room: Room): Promise<Message[]> => {
  return await prisma.message.findMany({
    where: {
      roomPk: room.pk,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const createMessage = async (
  body: string,
  sender: User,
  room: Room
): Promise<Message> => {
  return await prisma.message.create({
    data: {
      body,
      senderPk: sender.pk,
      roomPk: room.pk,
    },
  });
};

export const getUserBySub = async (openIdSub: string) => {
  return await prisma.user.findUnique({
    where: {
      openIdSub,
    },
  });
};

export const createUser = async (
  openIdSub: string,
  username: string,
  avatarUrl?: string
) => {
  return await prisma.user.upsert({
    where: {
      openIdSub,
    },
    create: {
      openIdSub,
      username,
      avatarUrl,
    },
    update: {
      username,
      avatarUrl,
    },
  });
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const getIsUserInRoom = async (
  user: User,
  room: Room
): Promise<boolean> => {
  const userInRoom = await prisma.user.findFirst({
    where: {
      id: user.id,
      rooms: {
        some: {
          id: room.id,
        },
      },
    },
  });

  return Boolean(userInRoom);
};

export const addUserToRoom = async (user: User, room: Room) => {
  await prisma.user.update({
    where: { id: user.id },
    data: {
      rooms: {
        connect: [{ id: room.id }],
      },
    },
  });
};

export const removeUserFromRoom = async (user: User, room: Room) => {
  await prisma.user.update({
    where: { id: user.id },
    data: {
      rooms: {
        disconnect: [{ id: room.id }],
      },
    },
  });
};

export const upsertRoom = async (name?: string, room?: Room) => {
  return await prisma.room.create({
    data: {
      name,
    },
  });
};

export const getRoomById = async (id: string) => {
  return await prisma.room.findUnique({
    where: {
      id,
    },
  });
};

export const findUsersWithUsernameLike = async (
  query: string
): Promise<User[]> => {
  return await prisma.$queryRaw<
    User[]
  >`SELECT * FROM User WHERE username LIKE ${query};`;
};
