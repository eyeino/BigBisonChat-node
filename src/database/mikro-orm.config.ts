import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { Message } from './entities/Messages';
import { User } from './entities/Users';

export default {
  entities: [Message, User],
  type: 'postgresql',
  dbName: 'bigbisonchat',
  user: 'ian',
  password: 'daphne',
  driverOptions: {
    connection: { ssl: { rejectUnauthorized: false } },
  },
} as MikroOrmModuleOptions;
