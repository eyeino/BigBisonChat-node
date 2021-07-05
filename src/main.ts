import { initServer } from './app/server';
import createSubscriber from 'pg-listen';

(async function main() {
  const server = initServer();

  const subscriber = createSubscriber({
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST || 'db',
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
  });

  subscriber.notifications.on('new_message', (payload) => {
    // Payload as passed to subscriber.notify() (see below)
    console.log("Received notification in 'new_message':", payload);
  });

  subscriber.events.on('error', (error) => {
    console.error('Fatal database connection error:', error);
  });

  await subscriber.connect();
  await subscriber.listenTo('new_message');

  await subscriber.notify('new_message', { hello: 'world!' });

  const port = Number(process.env.PORT) || 8080;

  server.listen(port, async () => {
    console.log(`server listening on port ${port}`);
  });
})();
