import jwt = require("express-jwt");
import jwksRsa = require("jwks-rsa");

export const checkJwtMiddleware = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://bigbisonchat.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  aud: "https://bigbisonchat.herokuapp.com",
  issuer: `https://bigbisonchat.auth0.com/`,
  algorithms: ["RS256"],
});
