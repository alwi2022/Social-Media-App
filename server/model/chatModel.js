const { ObjectId } = require("mongodb");
const database = require("../config/mongo");

class ChatModel {
    static collection() {
      return database.collection("chats");
    }
  
    static async findOne(query) {
      const chat = await this.collection().findOne(query);
      if (chat) {
        chat.messages = Array.isArray(chat.messages) ? chat.messages : []; // 🔥 Pastikan messages selalu array
      }
      return chat;
    }
  
    static async createChat(user1, user2) {
      const newChat = {
        users: [new ObjectId(user1), new ObjectId(user2)],
        messages: [], // 🔥 Inisialisasi sebagai array kosong
        createdAt: new Date(),
      };
      const result = await this.collection().insertOne(newChat);
      return { _id: result.insertedId, ...newChat };
    }
  
    static async getChats(userId) {
      const chats = await this.collection()
        .find({ users: new ObjectId(userId) })
        .toArray();
      
      return chats.map(chat => ({
        ...chat,
        messages: Array.isArray(chat.messages) ? chat.messages : [], // 🔥 Pastikan messages selalu array
      }));
    }
}

  
  

module.exports = ChatModel;
