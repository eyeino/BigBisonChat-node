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
      roomId: room.id,
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
      senderId: sender.id,
      roomId: room.id,
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
