import { initServer } from "./app/server";

(function main() {
  const server = initServer();

  const port = Number(process.env.PORT) || 8080;

  server.listen(port, async () => {
    console.log(`server listening on port ${port}`);
  });
})();
