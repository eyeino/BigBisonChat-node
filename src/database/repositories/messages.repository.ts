import { EntityRepository } from '@mikro-orm/postgresql';
import { Messages } from '../entities/Messages';
import { Users } from '../entities/Users';

export class MessagesRepository extends EntityRepository<Messages> {
  async createMessage(
    sender: Users,
    recipient: Users,
    body: string
  ): Promise<Messages> {
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
