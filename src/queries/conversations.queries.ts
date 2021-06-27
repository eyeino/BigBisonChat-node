/** Types generated for queries found in "app/queries/conversations.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'FindConversationsByUserId' parameters type */
export interface IFindConversationsByUserIdParams {
  userId: number | null | void;
}

/** 'FindConversationsByUserId' return type */
export interface IFindConversationsByUserIdResult {
  message_id: number | null;
  body: string | null;
  other_username: string | null;
  created_at: Date | null;
  avatar_url: string | null;
}

/** 'FindConversationsByUserId' query type */
export interface IFindConversationsByUserIdQuery {
  params: IFindConversationsByUserIdParams;
  result: IFindConversationsByUserIdResult;
}

const findConversationsByUserIdIR: any = {"name":"FindConversationsByUserId","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":121,"b":126,"line":3,"col":54},{"a":155,"b":160,"line":3,"col":88}]}}],"usedParamSet":{"userId":true},"statement":{"body":"(WITH relevant_messages AS (\n    SELECT * FROM messages WHERE ((messages.sender = :userId) OR (messages.recipient = :userId))),\n\nsummed_messages AS (\n    SELECT sender + recipient AS sum, * FROM relevant_messages\n),\n\nconversations AS (\n    SELECT DISTINCT ON (sum) * FROM summed_messages\n    ORDER BY (sum), created_at DESC\n),\n\nuser_sent AS (\n    SELECT message_id, body, username as other_username, (sent.created_at), avatar_url FROM\n    (SELECT * FROM conversations\n    WHERE conversations.sender = $1) AS sent\n    LEFT JOIN users ON sent.recipient = users.user_id\n),\n\nuser_received AS (\n    SELECT message_id, body, username as other_username, (received.created_at), avatar_url FROM\n    (SELECT * FROM conversations\n    WHERE conversations.recipient = $1) AS received\n    LEFT JOIN users ON received.sender = users.user_id\n)\n\nSELECT * FROM user_sent\nUNION ALL\nSELECT * FROM user_received\nORDER BY created_at DESC)","loc":{"a":38,"b":953,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * (WITH relevant_messages AS (
 *     SELECT * FROM messages WHERE ((messages.sender = :userId) OR (messages.recipient = :userId))),
 * 
 * summed_messages AS (
 *     SELECT sender + recipient AS sum, * FROM relevant_messages
 * ),
 * 
 * conversations AS (
 *     SELECT DISTINCT ON (sum) * FROM summed_messages
 *     ORDER BY (sum), created_at DESC
 * ),
 * 
 * user_sent AS (
 *     SELECT message_id, body, username as other_username, (sent.created_at), avatar_url FROM
 *     (SELECT * FROM conversations
 *     WHERE conversations.sender = $1) AS sent
 *     LEFT JOIN users ON sent.recipient = users.user_id
 * ),
 * 
 * user_received AS (
 *     SELECT message_id, body, username as other_username, (received.created_at), avatar_url FROM
 *     (SELECT * FROM conversations
 *     WHERE conversations.recipient = $1) AS received
 *     LEFT JOIN users ON received.sender = users.user_id
 * )
 * 
 * SELECT * FROM user_sent
 * UNION ALL
 * SELECT * FROM user_received
 * ORDER BY created_at DESC)
 * ```
 */
export const findConversationsByUserId = new PreparedQuery<IFindConversationsByUserIdParams,IFindConversationsByUserIdResult>(findConversationsByUserIdIR);


