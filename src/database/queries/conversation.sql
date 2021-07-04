/* @name FindConversation */
(WITH conversation AS (
    SELECT *
    FROM messages
    WHERE (messages.recipient = :recipient AND messages.sender = :sender)
    OR (messages.sender = :recipient AND messages.recipient = :sender)
    ORDER BY created_at DESC LIMIT 20 OFFSET :offset::int /* typecast to work around pgtyped bug */
    ),

almost_full_message AS (
    SELECT
        body,
        conversation.created_at,
        username as sender_username,
        sender,
        recipient,
        message_id
    FROM conversation
    LEFT JOIN users ON conversation.sender = users.user_id
)

SELECT
    body,
    almost_full_message.created_at,
    sender_username,
    username as recipient_username,
    sender,
    recipient,
    message_id	
FROM almost_full_message
LEFT JOIN users ON almost_full_message.recipient = users.user_id
ORDER BY created_at ASC);