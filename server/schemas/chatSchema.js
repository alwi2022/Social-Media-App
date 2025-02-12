const connectDB = require("../config/mongo");
const firebaseDB = require("../config/firebase");

const typeDefs = `#graphql
  type Chat {
    id: ID!
    user1: ID!
    user2: ID!
  }

  type Message {
    id: ID!
    chatId: String!
    senderId: String!
    receiverId: String!
    text: String!
    timestamp: String!
  }

  type Query {
    getUserChats(userId: ID!): [Chat]
    getMessages(chatId: String!): [Message]
  }

  type Mutation {
    createChat(user1: ID!, user2: ID!): Chat
    sendMessage(chatId: String!, senderId: ID!, receiverId: ID!, text: String!): Message
  }
`;

const resolvers = {
  Query: {
    getUserChats: async (_, { userId }) => {
      const db = await connectDB();
      return db.collection("chats").find({ $or: [{ user1: userId }, { user2: userId }] }).toArray();
    },
    getMessages: async (_, { chatId }) => {
      const messagesRef = firebaseDB.ref(`messages/${chatId}`);
      const snapshot = await messagesRef.once("value");
      const messages = snapshot.val();
      return messages ? Object.keys(messages).map((key) => ({ id: key, ...messages[key] })) : [];
    },
  },
  Mutation: {
    createChat: async (_, { user1, user2 }) => {
      const db = await connectDB();
      const newChat = { user1, user2 };
      const result = await db.collection("chats").insertOne(newChat);
      return { id: result.insertedId, ...newChat };
    },
    sendMessage: async (_, { chatId, senderId, receiverId, text }) => {
      const messagesRef = firebaseDB.ref(`messages/${chatId}`);
      const newMessageRef = messagesRef.push();

      const messageData = {
        id: newMessageRef.key,
        chatId,
        senderId,
        receiverId,
        text,
        timestamp: new Date().toISOString(),
      };

      await newMessageRef.set(messageData);
      return messageData;
    },
  },
};

module.exports = { typeDefs, resolvers };
