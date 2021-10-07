import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './repositories/messages.repository';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class DatabaseService {
  constructor(
    readonly usersRepository: UsersRepository,
    readonly messagesRepository: MessagesRepository
  ) {}
}
