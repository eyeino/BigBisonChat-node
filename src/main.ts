import { initServer } from './app/server';

(async function main() {
  const server = await initServer();

  const port = Number(process.env.PORT) || 8080;

  server.listen(port, async () => {
    console.log(`Server listening on port ${port}...`);
  });
})();
