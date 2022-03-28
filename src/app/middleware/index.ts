import cors = require('cors');
import express from 'express';

import { ignoreFaviconMiddleware } from './ignoreFavicon';
import { checkJwtMiddleware } from './checkJwt';


const corsMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  let productionOrigin = "https://chat.bigbison.co";
  
  if (req.url.includes('vercel')) {
    productionOrigin = "https://bigbisonchat.vercel.app";
  }

  const corsOptions: cors.CorsOptions = {
    origin:
      process.env.NODE_ENV === 'production'
        ? productionOrigin
        : 'http://localhost:3000',
    optionsSuccessStatus: 200,
  };
  
  
  cors(corsOptions)(req, res, next)
}

export { ignoreFaviconMiddleware, corsMiddleware, checkJwtMiddleware };
