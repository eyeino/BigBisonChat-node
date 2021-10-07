import { ReflectMetadataProvider } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversationsModule } from './conversations/conversations.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['./dist/database/entities'],
      entitiesTs: ['./src/database/entities'],
      dbName: 'bigbisonchat',
      user: 'ian',
      password: 'daphne',
      host: '127.0.0.1',
      port: 5432,
      type: 'postgresql',
      metadataProvider: ReflectMetadataProvider,
    }),
    ConversationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
