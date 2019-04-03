const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { saveMessage, loadNewestMessages } = require('./mongo');

app.get('/chat', async (req, res) => {
  console.log('received request at /chat');
  const messages = await loadNewestMessages(10, 1, 2);
  
  res.json(messages);
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