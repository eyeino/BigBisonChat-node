const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true });
const db = mongoose.connection;

const messageSchema = new Schema({
  senderId: Number,
  recipientId: Number,
  timestamp: { type: Date, default: Date.now },
  body: String,
  conversationId: Number
});

const Message = mongoose.model('Message', messageSchema);

function saveMessage(senderId, recipientId, body, callback) {
  let message = new Message;
  message.senderId = senderId;
  message.recipientId = recipientId;
  message.body = body;
  message.save(callback);
}

async function loadNewestMessages(count, senderId, recipientId) {
  const criteria = {
    senderId: senderId,
    recipientId: recipientId
  }
  const invertedCriteria = {
    senderId: recipientId,
    recipientId: senderId
  }

  const query = Message.find({$or:[criteria, invertedCriteria]}).sort('date').limit(count);
  return await query.exec()
}

module.exports = {
  loadNewestMessages,
  saveMessage
}