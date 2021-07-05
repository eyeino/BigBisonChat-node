import { ClientConfig, Pool } from 'pg';
import {
  findConversation,
  findConversationsByUserId,
  createUser,
  findUserIdByUsername,
  findUsersLikeUsername,
  insertMessage,
  findUsernameById,
} from './queries';

import dotenv = require('dotenv');
import { IFindConversationsByUserIdResult } from './queries/conversations.queries';
import { IFindConversationResult } from './queries/conversation.queries';
import { IInsertMessageResult } from './queries/insertMessage.queries';
import { IFindUsersLikeUsernameResult } from './queries/findUsers.queries';

dotenv.config();

export const config: ClientConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      port: Number(process.env.DB_PORT),
      host: process.env.DB_HOST || 'db',
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
    };

const pool = new Pool(config);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function getConversations(
  userId: number
): Promise<IFindConversationsByUserIdResult[]> {
  const client = await pool.connect();

  const conversations = await findConversationsByUserId.run(
    {
      userId,
    },
    client
  );

  client.release();

  return conversations;
}

export async function getConversation(
  sender: number,
  recipient: number,
  offset = 0
): Promise<IFindConversationResult[]> {
  const client = await pool.connect();

  const conversation = await findConversation.run(
    {
      sender,
      recipient,
      offset,
    },
    client
  );

  client.release();

  return conversation;
}

export async function makeUser(
  username: string,
  open_id_sub: string,
  avatar_url: string
): Promise<void> {
  const client = await pool.connect();

  await createUser.run(
    {
      username,
      open_id_sub,
      avatar_url,
    },
    client
  );

  client.release();
}

export async function getUserId(username: string): Promise<number> {
  const client = await pool.connect();

  const id = await findUserIdByUsername.run(
    {
      username,
    },
    client
  );

  client.release();

  return id[0].user_id;
}

export async function getUsernameById(id: number): Promise<string> {
  const client = await pool.connect();

  const username = await findUsernameById.run(
    {
      user_id: id,
    },
    client
  );

  client.release();

  return username[0].username;
}

export async function sendMessage(
  sender: number,
  recipient: number,
  body: string
): Promise<IInsertMessageResult> {
  const client = await pool.connect();

  const id = await insertMessage.run(
    {
      body,
      recipient,
      sender,
    },
    client
  );

  client.release();

  return id[0];
}

export async function searchUsers(
  query: string
): Promise<IFindUsersLikeUsernameResult[]> {
  const client = await pool.connect();

  const results = await findUsersLikeUsername.run(
    {
      query,
    },
    client
  );

  client.release();

  return results;
}
