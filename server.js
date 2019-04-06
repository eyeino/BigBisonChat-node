const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://bigbisonchat.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  aud: 'https://bigbisonchat.herokuapp.com',
  issuer: `https://bigbisonchat.auth0.com/`,
  algorithms: ['RS256']
});

const { saveMessage, loadNewestMessages } = require('./mongo/mongo-Message');

app.use(cors());

app.get('/chat', checkJwt, async (req, res) => {
  console.log('received request at /chat');
  const messages = await loadNewestMessages(10, 1, 2);
  
  res.json(messages);
})

app.get("*", (req, res) => {
  res.sendStatus(404);
})

io.on('connection', socket => {
  socket.on('newMessage', messageData => {
    // save to mongodb
    // saveMessage()

    console.log(messageData)
  });
});

port = process.env.PORT || 8080;
server.listen(port, async () => {
  console.log(`server listening on port ${port}`);
});