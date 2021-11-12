import {
  Entity,
  EntityRepositoryType,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { MessagesRepository } from '../repositories/messages.repository';
import { User } from './Users';

@Entity({ tableName: 'messages' })
export class Message {
  [EntityRepositoryType]?: MessagesRepository;

  @PrimaryKey()
  messageId!: number;

  @Property({
    columnType: 'timestamp',
    length: 6,
    nullable: true,
    defaultRaw: `CURRENT_TIMESTAMP`,
  })
  createdAt?: Date;

  @Property({ length: 6000, nullable: true })
  body?: string;

  @Index({ name: 'Index_message-sender' })
  @ManyToOne({ entity: () => User, fieldName: 'sender', nullable: true })
  sender?: User;

  @Index({ name: 'Index_message-recipient' })
  @ManyToOne({ entity: () => User, fieldName: 'recipient', nullable: true })
  recipient?: User;
}
