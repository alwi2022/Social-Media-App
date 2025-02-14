const { ObjectId } = require("mongodb");
const ChatModel = require("../model/chatModel"); // ✅ Pastikan import ini ada!
const UserModel = require("../model/userModel");
const followModel = require("../model/followModel");

const typeDefs = `#graphql
type Chat {
  _id: ID
  users: [User]
  messages: [Message]
  createdAt: String
}

type Message {
  sender: User
  content: String
  createdAt: String
}

type Query {
  getChats: [Chat]
  getFollowedUsers: [User]
}

type Mutation {
  createChat(username: String!): Chat
  deleteChat(chatId: ID!): Chat
  sendMessage(chatId: ID!, content: String!): Message
}
`;

const resolvers = {
  Query: {
    getChats: async (_, __, { authentication }) => {
      const user = await authentication();
      if (!user) throw new Error("Unauthorized");

      const chats = await ChatModel.collection()
        .aggregate([
          {
            $match: { users: new ObjectId(user._id) }, // Hanya ambil chat yang melibatkan user ini
          },
          {
            $lookup: {
              from: "users",
              localField: "users",
              foreignField: "_id",
              as: "users",
            },
          },
          {
            $unwind: {
              path: "$messages",
              preserveNullAndEmptyArrays: true, // ✅ Agar chat tanpa pesan tetap muncul
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "messages.sender",
              foreignField: "_id",
              as: "messageSender",
            },
          },
          {
            $unwind: {
              path: "$messageSender",
              preserveNullAndEmptyArrays: true, // ✅ Jika belum ada sender, jangan error
            },
          },

          {
            $match: {
              "messages.content": { $ne: null },
              "messageSender.username": { $ne: null },
            }, // ✅ Filter pesan kosong
          },
          {
            $group: {
              _id: "$_id",
              users: { $first: "$users" },
              messages: {
                $push: {
                  content: "$messages.content",
                  createdAt: "$messages.createdAt",
                  sender: {
                    _id: "$messageSender._id",
                    username: "$messageSender.username",
                    email: "$messageSender.email",
                    name: "$messageSender.name",
                  },
                },
              },
              createdAt: { $first: "$createdAt" },
            },
          },
        ])
        .toArray();

      return chats;
    },
    getFollowedUsers: async (_, __, { authentication }) => {
      const user = await authentication();
      if (!user) throw new Error("Unauthorized");

      console.log("🚀 getFollowedUsers dipanggil oleh:", user.username);

      // 🔥 Ambil daftar user yang diikuti oleh user yang login
      const followedUserIds = await followModel
        .collection("follows")
        .find({ followerId: new ObjectId(user._id) }) // Temukan user yang diikuti
        .project({ followingId: 1, _id: 0 }) // Ambil hanya ID pengguna yang diikuti
        .toArray();

      if (!followedUserIds.length) {
        console.log("⚠️ Tidak ada user yang diikuti.");
        return [];
      }

      // 🔥 Ambil detail user dari koleksi `users`
      const followedUsers = await UserModel.collection()
        .find({ _id: { $in: followedUserIds.map((f) => f.followingId) } })
        .project({ _id: 1, username: 1, email: 1, name: 1 })
        .toArray();

      console.log("✅ Followed users fetched:", followedUsers);
      return followedUsers;
    },
  },

  Mutation: {
    createChat: async (_, { username }, { authentication }) => {
      console.log("🔥 createChat dipanggil dengan username:", username);

      const user = await authentication();
      if (!user) {
        console.log("🚨 User tidak terautentikasi");
        throw new Error("Unauthorized");
      }

      const targetUser = await UserModel.findOne({ username });
      if (!targetUser) {
        console.log("🚨 User tujuan tidak ditemukan:", username);
        throw new Error("User not found");
      }

      let chat = await ChatModel.findOne({
        users: { $all: [user._id, targetUser._id] },
      });

      if (!chat) {
        chat = await ChatModel.createChat(user._id, targetUser._id);
      }

      console.log("✅ Chat berhasil dibuat:", chat);
      return chat;
    },

    sendMessage: async (_, { chatId, content }, { authentication, io }) => {
      const user = await authentication();
      if (!user) throw new Error("Unauthorized");

      const message = {
        sender: new ObjectId(user._id), // 🔥 Simpan sebagai ObjectId yang valid
        content,
        createdAt: new Date(),
      };

      await ChatModel.collection().updateOne(
        { _id: new ObjectId(chatId) },
        { $push: { messages: message } }
      );

      // 🔥 Ambil detail user setelah menyimpan pesan
      const senderDetail = {
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
      };

      const fullMessage = {
        content: message.content,
        createdAt: message.createdAt,
        sender: senderDetail, // 🔥 Pastikan `sender` memiliki data lengkap
      };

      // 🔥 Kirim pesan real-time ke semua user dalam chat tersebut
      io.to(chatId).emit("newMessage", fullMessage);

      return fullMessage; // ✅ Kembalikan data lengkap agar langsung tampil di frontend
    },

    deleteChat: async (_, { chatId }) => {
      const chat = await ChatModel.collection().findOne({
        _id: new ObjectId(chatId),
      });

      if (!chat) throw new Error("Chat not found");

      await ChatModel.collection().deleteOne({ _id: new ObjectId(chatId) });

      return chat;
    },
  },
};

module.exports = { typeDefs, resolvers };
