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
      type: 'postgresql',
      port: 5432,
      autoLoadEntities: true,
      metadataProvider: ReflectMetadataProvider,
    }),
    ConversationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
