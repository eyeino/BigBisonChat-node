const { Pool } = require('pg');

require('dotenv').config();

let pool = null;

// check if deployment has remote DB URI,
// otherwise connect to local DB using environment variables
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
} else {
  pool = new Pool();
}

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
})

const queryStrings = {
  // parameter $1: current user's id
  readConversations: `SELECT array_to_json(array_agg(row_to_json(t))) FROM
    (WITH relevant_messages AS (
      SELECT * FROM messages WHERE ((messages.sender = $1) OR (messages.recipient = $1))),
    
    summed_messages AS (
      SELECT sender + recipient AS sum, * FROM relevant_messages
    ),
    
    conversations AS (
      SELECT DISTINCT ON (sum) * FROM summed_messages
      ORDER BY (sum), created_at DESC
    ),
    
    user_sent AS (
      SELECT message_id, body, username as other_username, (sent.created_at), avatar_url FROM
      (SELECT * FROM conversations
      WHERE conversations.sender = $1) AS sent
      LEFT JOIN users ON sent.recipient = users.user_id
    ),
    
    user_received AS (
      SELECT message_id, body, username as other_username, (received.created_at), avatar_url FROM
      (SELECT * FROM conversations
      WHERE conversations.recipient = $1) AS received
      LEFT JOIN users ON received.sender = users.user_id
    )
    
    SELECT * FROM user_sent
    UNION ALL
    SELECT * FROM user_received
    ORDER BY created_at DESC) t;`,

  // parameter $1: current user's id, $2: id of other user in chat
  readChatMessages: `SELECT array_to_json(array_agg(row_to_json(t))) FROM

  (WITH conversation AS (
    SELECT *
    FROM messages
    WHERE (messages.recipient = $1 AND messages.sender = $2)
    OR (messages.sender = $1 AND messages.recipient = $2)
    ORDER BY created_at DESC LIMIT 20
  )
  
  SELECT
    body,
    conversation.created_at,
    username as sender_username,
    sender,
    recipient,
    message_id
  FROM conversation LEFT JOIN users
  ON conversation.sender = users.user_id
  ORDER BY created_at ASC) t;`,

  // parameter $1: current user's username
  readUserId: `SELECT array_to_json(array_agg(row_to_json(t))) FROM (
    SELECT user_id FROM users WHERE username = $1) t;`,

  // parameter $1: search query for username
  readUserSearchResults: `SELECT array_to_json(array_agg(row_to_json(t))) FROM (
    SELECT user_id, username FROM users WHERE username LIKE $1 LIMIT 10) t;`,

  // parameter $1: username, $2: the entire Open ID sub value (unique value to identify user supplied in JWT during authentication)
  insertUser: `INSERT INTO users (username, open_id_sub, avatar_url) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`,

  // parameter $1: sender id, $2: recipient id, $3: body of message
  insertMessage: `INSERT INTO messages(sender, recipient, body)
  VALUES ($1, $2, $3);`
}

async function readQuery(queryString, paramList) {
  const client = await pool.connect();
  try {
    const res = await client.query(queryString, paramList);
    // console.log(JSON.stringify(res.rows[0]["array_to_json"], null, 4));
    return res.rows[0]["array_to_json"];
  } finally {
    client.release();
  }
}

async function insertQuery(queryString, paramList) {
  const client = await pool.connect();
  try {
    const res = await client.query(queryString, paramList);
    console.log(res);
    return res;
  } finally {
    client.release();
  }
}

module.exports = {
  queryStrings,
  insertQuery,
  readQuery
}