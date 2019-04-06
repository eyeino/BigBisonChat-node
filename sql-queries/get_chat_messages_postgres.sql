SELECT array_to_json(array_agg(row_to_json(t))) FROM
(SELECT body, created_at, sender, recipient FROM messages WHERE ((messages.recipient = 1 AND messages.sender = 2) OR (messages.sender = 1 AND messages.recipient = 2))
ORDER BY created_at ASC LIMIT 20) t;