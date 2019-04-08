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
  (SELECT username AS recipient, recipient as recipientId, sender as senderId, body, created_at FROM users INNER JOIN (
  SELECT DISTINCT ON (sum) recipient, sender, body
  FROM (
  SELECT message_id, created_at, sender, recipient, body, sender + recipient AS sum
  FROM (
  SELECT * FROM messages
  WHERE ((messages.sender = $1) OR (messages.recipient = $1))) AS relevant_messages) AS summed_messages
  ORDER BY sum, created_at DESC) AS conversations ON conversations.recipient = users.user_id) t;`,

  // parameter $1: current user's id, $2: id of other user in chat
  readChatMessages: `SELECT array_to_json(array_agg(row_to_json(t))) FROM
  (SELECT body, created_at, sender, recipient FROM messages WHERE ((messages.recipient = $1 AND messages.sender = $2) OR (messages.sender = $1 AND messages.recipient = $2))
  ORDER BY created_at ASC LIMIT 20) t;`,

  // parameter $1: current user's username
  readUserId: `SELECT array_to_json(array_agg(row_to_json(t))) FROM (
    SELECT user_id FROM users WHERE username = $1) t;`,

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
    console.log(JSON.stringify(res.rows[0]["array_to_json"], null, 4));
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