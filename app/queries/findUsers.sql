/* @name FindUsersLikeUsername */
SELECT user_id, username FROM users WHERE username LIKE :query LIMIT 10;