import { Repository } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Messages } from '../entities/Messages';

@Repository(Messages)
export class MessagesRepository extends EntityRepository<Messages> {
  async createMessage(
    sender: number,
    recipient: number,
    body: string
  ): Promise<Messages> {
    const createdMessage = this.create({
      sender,
      recipient,
      body,
    });

    await this.persistAndFlush(createdMessage);

    return createdMessage;
  }
}
