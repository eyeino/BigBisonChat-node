import { Pool } from 'pg';
import {
  findConversation,
  findConversationsByUserId,
  createUser,
  findUserIdByUsername,
  findUsersLikeUsername,
  insertMessage
} from "./queries";

require('dotenv').config();

let pool: Pool;
// check if deployment has remote DB URI,
// otherwise connect to local DB using environment variables
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
} else {
  pool = new Pool();
}

pool.on('error', (err, _client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
})

export async function getConversations(userId: number) {
  const client = await pool.connect();

  const conversations = await findConversationsByUserId.run(
    {
      userId
    },
    client
  );

  client.release();

  return conversations;
}

export async function getConversation(sender: number, recipient: number, offset: number = 0) {
  const client = await pool.connect();

  const conversation = await findConversation.run({
    sender,
    recipient,
    offset
  }, client);

  client.release();

  return conversation;
}

export async function makeUser(username: string, open_id_sub: string, avatar_url: string) {
  const client = await pool.connect();

  await createUser.run({
    username,
    open_id_sub,
    avatar_url
  }, client);

  client.release();
}

export async function getUserId(username: string) {
  const client = await pool.connect();

  const id = await findUserIdByUsername.run({
    username
  }, client);

  client.release();

  return id[0].user_id;
}

export async function sendMessage(sender: number, recipient: number, body: string) {
  const client = await pool.connect();
  
  const id = await insertMessage.run({
    body,
    recipient,
    sender
  }, client);
  
  client.release();
  
  return id[0];
}

export async function searchUsers(query: string) {
  const client = await pool.connect();

  const results = await findUsersLikeUsername.run({
    query
  }, client);

  client.release();

  return results;
}