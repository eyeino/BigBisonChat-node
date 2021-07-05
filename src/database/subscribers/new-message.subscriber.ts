import createSubscriber, { Subscriber } from 'pg-listen';
import { Server as SocketServer, Socket } from 'socket.io';
import { config } from '..';
import { em, EmittableEvents } from '../../common';

export enum DatabaseEvents {
  NEW_MESSAGE = 'new_message',
}

export interface MessagePayload {
  message_id: number;
  created_at: string;
  body: string;
  sender: number;
  recipient: number;
}

function assertIsMessagePayload(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
): asserts payload is MessagePayload {
  if (
    !(
      typeof payload.message_id === 'number' &&
      typeof payload.created_at === 'string' &&
      typeof payload.body === 'string' &&
      typeof payload.sender === 'number' &&
      typeof payload.recipient === 'number'
    )
  ) {
    throw {
      message: 'Message payload sent to listener is malformed.',
      payload,
    };
  }
}

export async function setupNewMessageSubscriber(): Promise<Subscriber> {
  const subscriber = createSubscriber(config);

  subscriber.notifications.on(DatabaseEvents.NEW_MESSAGE, (payload) => {
    assertIsMessagePayload(payload);
    em.emit(EmittableEvents.RECEIVE_NEW_MESSAGE_FROM_DB, payload);
  });

  subscriber.events.on('error', (error) => {
    console.error('Fatal database connection error:', error);
  });

  await subscriber.connect();
  await subscriber.listenTo(DatabaseEvents.NEW_MESSAGE);

  return subscriber;
}
