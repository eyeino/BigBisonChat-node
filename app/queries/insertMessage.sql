/* @name InsertMessage */

WITH message AS (
    INSERT INTO messages(sender, recipient, body)
    VALUES (:sender, :recipient, :body)
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

SELECT * FROM full_message t;