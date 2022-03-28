import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { MessagesRepository } from '../repositories/messages.repository';
import { User } from './Users';

@Entity()
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

  @ManyToOne({ entity: () => User, fieldName: 'sender', nullable: true })
  sender?: User;

  @ManyToOne({ entity: () => User, fieldName: 'recipient', nullable: true })
  recipient?: User;
}
