import EventEmitter = require('eventemitter3');
import { getUsernameById } from '../database';
import { MessagePayload } from '../database/subscribers/new-message.subscriber';
import { determineEventNameFromUsernames } from '../util/jwt';

export enum EmittableEvents {
  RECEIVE_NEW_MESSAGE_FROM_DB = 'receive_message_from_db',
  EMIT_MESSAGE_TO_SOCKET = 'emit_message_to_socket',
}

const em = new EventEmitter();

em.on(
  EmittableEvents.RECEIVE_NEW_MESSAGE_FROM_DB,
  async (payload: MessagePayload) => {
    const recipient_username = await getUsernameById(payload.recipient);
    const sender_username = await getUsernameById(payload.sender);

    const eventName = determineEventNameFromUsernames(
      recipient_username,
      sender_username
    );

    em.emit(EmittableEvents.EMIT_MESSAGE_TO_SOCKET, eventName, {
      ...payload,
      recipient_username,
      sender_username,
    });
  }
);

export { em };
