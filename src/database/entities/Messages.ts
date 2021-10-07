import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { MessagesRepository } from '../repositories/messages.repository';
import { Users } from './Users';

@Entity()
export class Messages {
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

  @ManyToOne({ entity: () => Users, fieldName: 'sender', nullable: true })
  sender?: Users;

  @ManyToOne({ entity: () => Users, fieldName: 'recipient', nullable: true })
  recipient?: Users;
}
