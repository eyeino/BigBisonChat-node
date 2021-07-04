/** Types generated for queries found in "app/queries/insertMessage.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'InsertMessage' parameters type */
export interface IInsertMessageParams {
  sender: number | null | void;
  recipient: number | null | void;
  body: string | null | void;
}

/** 'InsertMessage' return type */
export interface IInsertMessageResult {
  body: string | null;
  created_at: Date | null;
  sender_username: string;
  recipient_username: string;
  sender: number | null;
  recipient: number | null;
  message_id: number;
}

/** 'InsertMessage' query type */
export interface IInsertMessageQuery {
  params: IInsertMessageParams;
  result: IInsertMessageResult;
}

const insertMessageIR: any = {"name":"InsertMessage","params":[{"name":"sender","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":108,"b":113,"line":5,"col":13}]}},{"name":"recipient","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":117,"b":125,"line":5,"col":22}]}},{"name":"body","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":129,"b":132,"line":5,"col":34}]}}],"usedParamSet":{"sender":true,"recipient":true,"body":true},"statement":{"body":"WITH message AS (\n    INSERT INTO messages(sender, recipient, body)\n    VALUES (:sender, :recipient, :body)\n    RETURNING *\n),\n  \nalmost_full_message AS (\nSELECT\n    body,\n    message.created_at,\n    username as sender_username,\n    sender,\n    recipient,\n    message_id\nFROM message\nLEFT JOIN users ON message.sender = users.user_id\n),\n\nfull_message AS (\nSELECT\n    body,\n    almost_full_message.created_at,\n    sender_username,\n    username as recipient_username,\n    sender,\n    recipient,\n    message_id\nFROM almost_full_message\nLEFT JOIN users\nON almost_full_message.recipient = users.user_id\n)\n\nSELECT * FROM full_message t","loc":{"a":27,"b":655,"line":3,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * WITH message AS (
 *     INSERT INTO messages(sender, recipient, body)
 *     VALUES (:sender, :recipient, :body)
 *     RETURNING *
 * ),
 *   
 * almost_full_message AS (
 * SELECT
 *     body,
 *     message.created_at,
 *     username as sender_username,
 *     sender,
 *     recipient,
 *     message_id
 * FROM message
 * LEFT JOIN users ON message.sender = users.user_id
 * ),
 * 
 * full_message AS (
 * SELECT
 *     body,
 *     almost_full_message.created_at,
 *     sender_username,
 *     username as recipient_username,
 *     sender,
 *     recipient,
 *     message_id
 * FROM almost_full_message
 * LEFT JOIN users
 * ON almost_full_message.recipient = users.user_id
 * )
 * 
 * SELECT * FROM full_message t
 * ```
 */
export const insertMessage = new PreparedQuery<IInsertMessageParams,IInsertMessageResult>(insertMessageIR);


