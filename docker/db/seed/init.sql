COPY users(user_id, username, email, first_name, last_name, avatar_url, created_at, open_id_sub)
FROM '/seed/users-example.csv'
DELIMITER ','
CSV HEADER;

COPY messages(message_id, created_at, body, sender, recipient)
FROM '/seed/messages-example.csv'
DELIMITER ','
CSV HEADER;