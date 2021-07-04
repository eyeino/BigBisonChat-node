import { Pool } from 'pg';
import {
  findConversation,
  findConversationsByUserId,
  createUser,
  findUserIdByUsername,
  findUsersLikeUsername,
  insertMessage,
} from './queries';

import dotenv = require('dotenv');
import { IFindConversationsByUserIdResult } from './queries/conversations.queries';
import { IFindConversationResult } from './queries/conversation.queries';
import { IInsertMessageResult } from './queries/insertMessage.queries';
import { IFindUsersLikeUsernameResult } from './queries/findUsers.queries';

dotenv.config();

let pool: Pool;
// check if deployment has remote DB URI,
// otherwise connect to local DB using environment variables
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool();
}

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
