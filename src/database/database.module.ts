import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Message } from './entities/Messages';
import { User } from './entities/Users';

@Module({
  imports: [MikroOrmModule.forFeature([Message, User])],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
