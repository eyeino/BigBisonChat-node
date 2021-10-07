import { Messages } from './entities/Messages';
import { Users } from './entities/Users';

export default {
  entities: [Messages, Users],
  type: 'postgresql',
  dbName: 'bigbisonchat',
  user: 'ian',
  password: 'daphne',
};
