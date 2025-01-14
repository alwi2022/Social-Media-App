require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const {
  typeDefs: typeDefsPost,
  resolvers: resolversPost,
} = require("./schemas/postSchema");

const {
  typeDefs: typeDefsUser,
  resolvers: resolversUser,
} = require("./schemas/userSchema");
const { verifyToken } = require("./helpers/jwt");
const UserModel = require("./model/userModel");

const server = new ApolloServer({
  typeDefs: [typeDefsUser, typeDefsPost],
  resolvers: [resolversUser, resolversPost],
  introspection: true,
  //introspection:true untuk kemudahan pembacaan buat instruktor
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    context: ({ req, res }) => {
      return {
        authentication: async () => {
          const  authorization  = req.headers.authorization
          if (!authorization) throw new Error("Please login first");

          const [type,token] = authorization.split(" ")
          // console.log(token,'ini token');
          
          if (type !== "Bearer") throw new Error("Invalid token");

          const payload = verifyToken(token);
          console.log(payload,'ini payload');
          
          const user = await UserModel.findById(payload.id);
          
          
          
          return user;
        },
      };
    },
  });
  console.log(`🚀 Server ready at: ${url}`);
}
startServer();
