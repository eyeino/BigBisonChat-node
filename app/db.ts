const { Pool } = require('pg');
import { findConversation } from "./queries/conversation.queries";
import { findConversationsByUserId } from "./queries/conversations.queries";
import { createUser } from "./queries/createUser.queries";
import { findUserIdByUsername } from "./queries/findUserId.queries";

require('dotenv').config();

let pool = null;

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

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
})

export const queryStrings = {
  // parameter $1: search query for username
  readUserSearchResults: `SELECT array_to_json(array_agg(row_to_json(t))) FROM (
    SELECT user_id, username FROM users WHERE username LIKE $1 LIMIT 10) t;`,

  // parameter $1: sender id, $2: recipient id, $3: body of message
  insertMessageSilently: `INSERT INTO messages(sender, recipient, body)
  VALUES ($1, $2, $3);`,

  // parameter $1: sender id, $2: recipient id, $3: body of message
  insertMessageAndReturnIt: `WITH message AS (
    INSERT INTO messages(sender, recipient, body)
    VALUES ($1, $2, $3)
    RETURNING *
  ),
  
  almost_full_message AS (
    SELECT
      body,
      message.created_at,
      username as sender_username,
      sender,
      recipient,
      message_id
    FROM message
    LEFT JOIN users ON message.sender = users.user_id
  ),
  
  full_message AS (
    SELECT
      body,
      almost_full_message.created_at,
      sender_username,
      username as recipient_username,
      sender,
      recipient,
      message_id
    FROM almost_full_message
    LEFT JOIN users
    ON almost_full_message.recipient = users.user_id
  )
  
  SELECT row_to_json(t) FROM full_message t;`
}

export async function readQuery(queryString, paramList) {
  const client = await pool.connect();
  try {
    const res = await client.query(queryString, paramList);
    return res.rows[0]["array_to_json"];
  } finally {
    client.release();
  }
}

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

export async function getConversation(sender: number, recipient: number) {
  const client = await pool.connect();

  const conversation = await findConversation.run({
    sender,
    recipient
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

export async function insertQuery(queryString, paramList) {
  const client = await pool.connect();
  try {
    const res = await client.query(queryString, paramList);
    // console.log(res);
    return res;
  } finally {
    client.release();
  }
}