require("dotenv").config();
// server setup
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

// const {
//   typeDefs: typeDefsPost,
//   resolvers: resolversPost,
// } = require("./schemas/post");

// const {
//   typeDefs: typeDefsFollow,
//   resolvers: resolversFollow,
// } = require("./schemas/follow");

// const {
//   typeDefs: typeDefsUser,
//   resolvers: resolversUser,
// } = require("./schemas/user");
const { GraphQLError } = require("graphql");
const { verifyToken } = require("./helpers/jwt");

// Initialize Apollo Server with schema and resolvers
const server = new ApolloServer({
  typeDefs: [typeDefsUser, typeDefsPost, typeDefsFollow],
  resolvers: [resolversUser, resolversPost, resolversFollow],
  introspection: true,
  //introspection:true untuk kemudahan pembacaan buat instruktor
});

// Start the server and listen on port 4000
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    context: ({ req }) => {
      return {
        authentication: () => {
          const { authorization } = req.headers;
          if (!authorization) {
            throw new GraphQLError("You're not authorized", {
              extensions: {
                code: "INVALID_TOKEN",
                http: { status: 401 },
              },
            });
          }

          const token = authorization.split(" ")[1];
          if (!token) {
            throw new GraphQLError("INVALID TOKEN", {
              extensions: {
                code: "UNAUTHORIZED",
                http: { status: 401 },
              },
            });
          }

          try {
            const payload = verifyToken(token);
            return payload; // return { user: payload };
          } catch (error) {
            console.error("Error verifying token:", error);
            throw new GraphQLError("INVALID TOKEN", {
              extensions: {
                code: "UNAUTHORIZED",
                http: { status: 401 },
              },
            });
          }
        },
      };
    },
  });
  console.log(`🚀 Server ready at: ${url}`);
}
startServer();
