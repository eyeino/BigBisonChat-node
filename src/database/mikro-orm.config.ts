import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { Message } from './entities/Messages';
import { User } from './entities/Users';

export default {
  entities: [Message, User],
  type: 'postgresql',
  ...(process.env.NODE_ENV === "production" && {
    clientUrl: process.env.DATABASE_URL,
    driverOptions: {
      connection: { ssl: { rejectUnauthorized: false } },
    },
  }),
  ...(process.env.NODE_ENV !== "production" && {
    dbName: 'bigbisonchat',
    user: 'ian',
    password: 'daphne',
    ...(process.env.IN_DOCKER_COMPOSE === "true" && { host: "db" }),
  })
} as MikroOrmModuleOptions;
