import { initServer } from './app/server';

(async function main() {
  const server = await initServer();

  const port = Number(process.env.PORT) || 8080;

  process.on('unhandledRejection', (reason) => {
    console.log('Unhandled Rejection at:', reason);
  });

  server.listen(port, async () => {
    console.log(`Server listening on port ${port}...`);
  });
})();
