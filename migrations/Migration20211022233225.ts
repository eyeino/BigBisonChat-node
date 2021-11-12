import { Migration } from '@mikro-orm/migrations';

export class Migration20211022233225 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("user_id" serial primary key, "username" varchar(50) not null, "email" varchar(255) null, "first_name" varchar(50) null, "last_name" varchar(50) null, "avatar_url" varchar(300) null, "created_at" timestamp null default CURRENT_TIMESTAMP, "open_id_sub" varchar(50) null);');
    this.addSql('alter table "users" add constraint "users_username_key" unique ("username");');
    this.addSql('alter table "users" add constraint "users_email_key" unique ("email");');

    this.addSql('create table "messages" ("message_id" serial primary key, "created_at" timestamp null default CURRENT_TIMESTAMP, "body" varchar(6000) null, "sender" int4 null, "recipient" int4 null);');
    this.addSql('create index "Index_message-sender" on "messages" ("sender");');
    this.addSql('create index "Index_message-recipient" on "messages" ("recipient");');

    this.addSql('alter table "messages" add constraint "messages_sender_foreign" foreign key ("sender") references "users" ("user_id") on update cascade on delete set null;');
    this.addSql('alter table "messages" add constraint "messages_recipient_foreign" foreign key ("recipient") references "users" ("user_id") on update cascade on delete set null;');
  }

}
