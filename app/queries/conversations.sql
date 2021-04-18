/* @name FindConversationsByUserId */
(WITH relevant_messages AS (
    SELECT * FROM messages WHERE ((messages.sender = :userId) OR (messages.recipient = :userId))),

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
ORDER BY created_at DESC);