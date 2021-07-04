import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    conversations: [Conversation]
    conversation(otherUserId: Int!, offset: Int): [Message]
  }

  type Subscription {
    messageStored(messageId: Int!): Message
  }

  type Conversation {
    message_id: Int
    body: String
    other_username: String
    created_at: String
    avatar_url: String
  }

  type Message {
    body: String
    created_at: String
    sender_username: String
    recipient_username: String
    sender: Int
    recipient: Int
    message_id: Int
  }
`;
