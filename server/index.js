require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { createServer } = require("http");
const { Server } = require("socket.io");

const {
  typeDefs: typeDefsPost,
  resolvers: resolversPost,
} = require("./schemas/postSchema");

const {
  typeDefs: typeDefsUser,
  resolvers: resolversUser,
} = require("./schemas/userSchema");

const {
  typeDefs: typeDefsFollow,
  resolvers: resolversFollow,
} = require("./schemas/follow");

const {
  typeDefs: typeDefsChat,
  resolvers: resolversChat,
} = require("./schemas/chatSchema");

const { verifyToken } = require("./helpers/jwt");
const UserModel = require("./model/userModel");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const server = new ApolloServer({
  typeDefs: [typeDefsUser, typeDefsPost, typeDefsFollow, typeDefsChat],
  resolvers: [resolversUser, resolversPost, resolversFollow, resolversChat],
  introspection: true,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT || 3000 },
    context: ({ req }) => {
      return {
        authentication: async () => {
          const authorization = req.headers.authorization;
          if (!authorization) throw new Error("Please login first");

          const [type, token] = authorization.split(" ");
          if (type !== "Bearer") throw new Error("Invalid token");

          const payload = verifyToken(token);
          const user = await UserModel.findById(payload.id);
          return user;
        },
        io, // Tambahkan Socket.io ke context
      };
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer.listen(process.env.SOCKET_PORT || 4000, () => {
    console.log(`🚀 WebSocket server running on port ${process.env.SOCKET_PORT || 4000}`);
  });

  console.log(`🚀 GraphQL API ready at: ${url}`);
}

startServer();
