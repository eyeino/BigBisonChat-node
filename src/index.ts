import SocketIO = require("socket.io");
import { initServer } from "./app/server";
import { em } from "./common";

function bootstrap() {
  const server = initServer();

  const port = Number(process.env.PORT) || 8080;

  server.listen(port, async () => {
    console.log(`server listening on port ${port}`);
  });
}

bootstrap();
