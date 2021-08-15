import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Users {
  @PrimaryKey()
  userId!: number;

  @Unique({ name: 'users_username_key' })
  @Property({ length: 50 })
  username!: string;

  @Unique({ name: 'users_email_key' })
  @Property({ length: 255, nullable: true })
  email?: string;

  @Property({ length: 50, nullable: true })
  firstName?: string;

  @Property({ length: 50, nullable: true })
  lastName?: string;

  @Property({ length: 300, nullable: true })
  avatarUrl?: string;

  @Property({
    columnType: 'timestamp',
    length: 6,
    nullable: true,
    defaultRaw: `CURRENT_TIMESTAMP`,
  })
  createdAt?: Date;

  @Property({ length: 50, nullable: true })
  openIdSub?: string;
}
