const express = require('express');
const cors = require('cors');

const db = require('./db/index');

// JWT for authentication with Auth0
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtDecode = require('jwt-decode');

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

// server initialization
const app = express();
const server = require('http').Server(app);
// const io = require('socket.io')(server);

// middleware
app.use(express.json());
app.use(cors());

// TODO: change this name.. decodeSub is a bit of a misnomer
// since it does more than that
function decodeSubFromRequestHeader(request) {
  const jwt = request.header('authorization').split(" ")[1];
  const decodedJwt = jwtDecode(jwt);
  return {
    sub: decodedJwt.sub,
    username: decodedJwt.nickname,
    picture: decodedJwt.picture
  }
}

// get list of conversations, with most recent message
app.get('/conversations', checkJwt, async (req, res) => {
  const userInfo = decodeSubFromRequestHeader(req);

  try {
    const userIdResults = await db.readQuery(db.queryStrings.readUserId, [
      userInfo.username
    ]);
    const userId = userIdResults[0]["user_id"];
    const conversations = await db.readQuery(
      db.queryStrings.readConversations,
      [userId]
    );
    res.json(conversations);
    return
  } catch(err) {
    await db.insertQuery(db.queryStrings.insertUser, [userInfo.username, userInfo.sub, userInfo.picture])
    res.redirect(req.originalUrl);
    return
  }
})

// get list of messages between two users
app.get('/conversations/:username', checkJwt, async (req, res) => {
  const userInfo = decodeSubFromRequestHeader(req);
  const userIdResults = await db.readQuery(db.queryStrings.readUserId, [userInfo.username]);
  const userId = userIdResults[0]["user_id"];
  
  const otherUserIdResults = await db.readQuery(db.queryStrings.readUserId, [req.params.username]);
  const otherUserId = otherUserIdResults[0]["user_id"];

  const messages = await db.readQuery(db.queryStrings.readChatMessages, [userId, otherUserId]);
  res.json(messages);
})

// send message to a user from a user
app.post('/conversations/:username', checkJwt, async (req, res) => {
  
  try {
    const userInfo = decodeSubFromRequestHeader(req);
    const userIdResults = await db.readQuery(db.queryStrings.readUserId, [
      userInfo.username
    ]);
    const userId = userIdResults[0]["user_id"];

    const otherUserIdResults = await db.readQuery(
      db.queryStrings.readUserId,
      [req.params.username]
    );
  
    const otherUserId = otherUserIdResults[0]["user_id"];

    const messageBody = req.body.messageBody;

    await db.insertQuery(db.queryStrings.insertMessage, [
      userId,
      otherUserId,
      messageBody
    ]);
    res.sendStatus(200);
    return
  } catch(err) {
    console.log(err)
    res.sendStatus(400);
    return
  }
})

app.get("*", (req, res) => {
  res.sendStatus(404);
})

// io.on('connection', socket => {
//   socket.on('newMessage', messageData => {
    
//     console.log(messageData)
//   });
// });

port = process.env.PORT || 8080;
server.listen(port, async () => {
  console.log(`server listening on port ${port}`);
});