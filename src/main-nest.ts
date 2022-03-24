import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { setupSocketIO } from './app/server';
import { setupNewMessageSubscriber } from './database/subscribers/new-message.subscriber';
import { setupGracefulShutdown } from './util/shutdown';
import { Server } from 'http';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = app.getHttpServer() as Server;
  setupGracefulShutdown(server);
  setupSocketIO(server);
  await setupNewMessageSubscriber();

  await app.listen(8080);
})();
