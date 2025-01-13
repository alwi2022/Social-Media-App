require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

// const {
//   typeDefs: typeDefsPost,
//   resolvers: resolversPost,
// } = require("./schemas/post");

const {
  typeDefs: typeDefsUser,
  resolvers: resolversUser,
} = require("./schemas/userSchema");

const server = new ApolloServer({
  typeDefs: [typeDefsUser],
  resolvers: [resolversUser],
  introspection: true,
  //introspection:true untuk kemudahan pembacaan buat instruktor
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
  });
  console.log(`🚀 Server ready at: ${url}`);
}
startServer();
