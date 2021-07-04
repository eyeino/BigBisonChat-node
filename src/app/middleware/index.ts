import cors = require("cors");

import { ignoreFaviconMiddleware } from "./ignoreFavicon";
import { checkJwtMiddleware } from "./checkJwt";

const corsOptions: cors.CorsOptions = {
  origin: process.env.PORT
    ? "https://chat.bigbison.co"
    : "http://localhost:3000",
  optionsSuccessStatus: 200,
};

const corsMiddleware = cors(corsOptions);

export { ignoreFaviconMiddleware, corsMiddleware, checkJwtMiddleware };
