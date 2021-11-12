import { Repository } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Message } from '../entities/Messages';

@Repository(Message)
export class MessagesRepository extends EntityRepository<Message> {
  async createMessage(
    sender: number,
    recipient: number,
    body: string
  ): Promise<Message> {
    const createdMessage = this.create({
      sender,
      recipient,
      body,
    });

    await this.persistAndFlush(createdMessage);

    return createdMessage;
  }
}
