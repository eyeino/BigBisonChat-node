import { PrismaClient, messages, users } from '@prisma/client';

const prisma = new PrismaClient();

// messages between two users
export const getConversation = async (
  userId1: number,
  userId2: number
): Promise<messages[]> => {
  return await prisma.messages.findMany({
    where: {
      OR: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 },
      ],
    },
    orderBy: {
      created_at: 'desc',
    },
  });
};

// last messages where user is either sender or recipient
export const getConversations = async (userId: number): Promise<messages[]> => {
  return await prisma.messages.findMany({
    where: {
      OR: [{ sender: userId }, { recipient: userId }],
      AND: [],
    },
    distinct: ['sender', 'recipient'],
    orderBy: {
      created_at: 'desc',
    },
  });
};

// get userId from openid sub
export const getUserBySub = async (
  open_id_sub: string
): Promise<users | null> => {
  return await prisma.users.findUnique({
    where: { open_id_sub },
  });
};

export const getUserByUsername = async (
  username: string
): Promise<users | null> => {
  return await prisma.users.findUnique({
    where: { username },
  });
};

export const upsertUser = async (
  open_id_sub: string,
  username: string,
  avatar_url?: string,
  first_name?: string,
  last_name?: string,
  email?: string
): Promise<users> => {
  const user = await getUserBySub(open_id_sub);
  if (user) return user;

  return await prisma.users.create({
    data: {
      username,
      avatar_url,
      first_name,
      last_name,
      email,
      open_id_sub,
    },
  });
};

export const searchUsers = async (query: string): Promise<users> => {
  return await prisma.$queryRaw`SELECT * FROM users WHERE username LIKE ${query}%`;
};

// create message
export const createMessage = async (
  senderId: number,
  recipientId: number,
  body: string
): Promise<messages> => {
  return await prisma.messages.create({
    data: {
      body,
      recipient: recipientId,
      sender: senderId,
    },
  });
};
