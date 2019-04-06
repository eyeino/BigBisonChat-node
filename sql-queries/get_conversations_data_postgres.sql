SELECT array_to_json(array_agg(row_to_json(t))) FROM
(SELECT username AS recipient, recipient as recipientId, sender as senderId, body, created_at FROM users INNER JOIN (
SELECT DISTINCT ON (sum) recipient, sender, body
FROM (
SELECT message_id, created_at, sender, recipient, body, sender + recipient AS sum
FROM (
SELECT * FROM messages
WHERE ((messages.sender = 1) OR (messages.recipient = 1))) AS relevant_messages) AS summed_messages
ORDER BY sum, created_at DESC) AS conversations ON conversations.recipient = users.user_id) t;