const UserModel = require("../model/userModel");

const typeDefs = `#graphql

    type User {
    _id: ID
    name: String
    username: String
    email: String
  }

  type Token{
  access_token: String
  }

  type Query {
        getUserById(id: ID!): User
    }

    type Mutation {
    register(name: String, username: String, email: String, password: String): User
    login(username: String,password: String): Token
  }
  `;

const resolvers = {
  Query: {
    getUserById: async (_, args) => {
      const { _id } = args;
      const user = UserModel.getUserById(_id);
      return user;
    },
  },

  Mutation: {
    register: async (_, args) => {
      console.log(args,'ini args');
      
      const { name, username, email, password } = args;
      const newUser = {name, username, email, password};

      await UserModel.register(newUser);

      return newUser
    },
    login: async (_, args) => {
      const { username, password } = args;
      const user = await UserModel.login(username, password);
      return user;
    },
  },
};

module.exports = { typeDefs, resolvers };
