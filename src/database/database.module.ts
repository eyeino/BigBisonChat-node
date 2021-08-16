import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MessagesRepository } from './repositories/messages.repository';
import { UsersRepository } from './repositories/users.repository';

const repositories = [MessagesRepository, UsersRepository];

@Module({
  providers: [...repositories, DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
