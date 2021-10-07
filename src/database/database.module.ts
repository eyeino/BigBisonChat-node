import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Messages } from './entities/Messages';
import { Users } from './entities/Users';

@Module({
  imports: [MikroOrmModule.forFeature([Messages, Users])],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
