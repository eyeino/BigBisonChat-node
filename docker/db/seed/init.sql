CREATE TABLE IF NOT EXISTS users (
    user_id serial PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar_url VARCHAR(300),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    open_id_sub VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS messages (
    message_id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    body VARCHAR(6000),
    sender INTEGER REFERENCES users,
    recipient INTEGER REFERENCES users
);

COPY users(user_id, username, email, first_name, last_name, avatar_url, created_at, open_id_sub)
FROM '/seed/users-example.csv'
DELIMITER ','
CSV HEADER;

COPY messages(message_id, created_at, body, sender, recipient)
FROM '/seed/messages-example.csv'
DELIMITER ','
CSV HEADER;