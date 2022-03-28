import { EntityRepository } from '@mikro-orm/postgresql';
import { Message } from '../entities/Messages';
import { User } from '../entities/Users';

export class MessagesRepository extends EntityRepository<Message> {
  async createMessage(
    sender: User,
    recipient: User,
    body: string
  ): Promise<Message> {
    const createdMessage = this.create({
      sender,
      recipient,
      body,
      messageId: 1,
    });

    await this.persistAndFlush(createdMessage);

    return createdMessage;
  }
}
