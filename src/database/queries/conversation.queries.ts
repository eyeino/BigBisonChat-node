/** Types generated for queries found in "app/queries/conversation.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'FindConversation' parameters type */
export interface IFindConversationParams {
  recipient: number | null | void;
  sender: number | null | void;
  offset: number | null | void;
}

/** 'FindConversation' return type */
export interface IFindConversationResult {
  body: string | null;
  created_at: Date | null;
  sender_username: string;
  recipient_username: string;
  sender: number | null;
  recipient: number | null;
  message_id: number;
}

/** 'FindConversation' query type */
export interface IFindConversationQuery {
  params: IFindConversationParams;
  result: IFindConversationResult;
}

const findConversationIR: any = {"name":"FindConversation","params":[{"name":"recipient","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":117,"b":125,"line":5,"col":33},{"a":185,"b":193,"line":6,"col":27}]}},{"name":"sender","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":150,"b":155,"line":5,"col":66},{"a":221,"b":226,"line":6,"col":63}]}},{"name":"offset","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":275,"b":280,"line":7,"col":46}]}}],"usedParamSet":{"recipient":true,"sender":true,"offset":true},"statement":{"body":"(WITH conversation AS (\n    SELECT *\n    FROM messages\n    WHERE (messages.recipient = :recipient AND messages.sender = :sender)\n    OR (messages.sender = :recipient AND messages.recipient = :sender)\n    ORDER BY created_at DESC LIMIT 20 OFFSET :offset::int\n    ),\n\nalmost_full_message AS (\n    SELECT\n        body,\n        conversation.created_at,\n        username as sender_username,\n        sender,\n        recipient,\n        message_id\n    FROM conversation\n    LEFT JOIN users ON conversation.sender = users.user_id\n)\n\nSELECT\n    body,\n    almost_full_message.created_at,\n    sender_username,\n    username as recipient_username,\n    sender,\n    recipient,\n    message_id\t\nFROM almost_full_message\nLEFT JOIN users ON almost_full_message.recipient = users.user_id\nORDER BY created_at ASC)","loc":{"a":29,"b":819,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * (WITH conversation AS (
 *     SELECT *
 *     FROM messages
 *     WHERE (messages.recipient = :recipient AND messages.sender = :sender)
 *     OR (messages.sender = :recipient AND messages.recipient = :sender)
 *     ORDER BY created_at DESC LIMIT 20 OFFSET :offset::int
 *     ),
 * 
 * almost_full_message AS (
 *     SELECT
 *         body,
 *         conversation.created_at,
 *         username as sender_username,
 *         sender,
 *         recipient,
 *         message_id
 *     FROM conversation
 *     LEFT JOIN users ON conversation.sender = users.user_id
 * )
 * 
 * SELECT
 *     body,
 *     almost_full_message.created_at,
 *     sender_username,
 *     username as recipient_username,
 *     sender,
 *     recipient,
 *     message_id	
 * FROM almost_full_message
 * LEFT JOIN users ON almost_full_message.recipient = users.user_id
 * ORDER BY created_at ASC)
 * ```
 */
export const findConversation = new PreparedQuery<IFindConversationParams,IFindConversationResult>(findConversationIR);


