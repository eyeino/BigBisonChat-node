const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true });
const db = mongoose.connection;

const messageSchema = new Schema({
  senderId: { type: Number, required: true },
  recipientId: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  body: { type: String, required: true }
});

const Message = mongoose.model('Message', messageSchema);

function saveMessage(senderId, recipientId,
  body, callback) {
  let message = new Message;
  message.senderId = senderId;
  message.recipientId = recipientId;
  message.body = body;
  message.save(callback);
}

async function loadNewestMessages(count,
  idOne, idTwo) {
  const criteria = {
    senderId: idOne,
    recipientId: idTwo
  }
  const invertedCriteria = {
    senderId: idTwo,
    recipientId: idOne
  }

  const query = Message
    .find({ $or: [criteria, invertedCriteria] })
    .sort('date')
    .limit(count);

  return await query.exec()
}

module.exports = {
  loadNewestMessages,
  saveMessage
}