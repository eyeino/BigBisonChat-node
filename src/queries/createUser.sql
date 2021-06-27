/* @name CreateUser */
INSERT INTO users (username, open_id_sub, avatar_url) VALUES (:username, :open_id_sub, :avatar_url) ON CONFLICT DO NOTHING;