const UserModel = require("../model/userModel");

const typeDefs = `#graphql

    type User {
    _id: ID
    name: String
    username: String
    email: String
    followers: [FollowUser]
    following: [FollowUser]
  }

  type FollowUser {
  username: String
  email: String
}
  

  type Token{
  access_token: String
  user_id: ID,
  }

  type Query {
        getUserById(_id: ID): User
        getUserByUserName(username:String): [User]
     
    }

    type Mutation {
    register(name: String, username: String, email: String, password: String): User
    login(username: String,password: String): Token
  }
  `;

const resolvers = {
  Query: {
    getUserById: async (_, args, { authentication }) => {
      await authentication();
      const { _id } = args;
      const user = await UserModel.findById(_id);
      return user;
    },

    getUserByUserName: async (_, args, { authentication }) => {
      await authentication();
      const { username } = args;
      const result = await UserModel.getUsername(username);

      return result;
    },
  },

  Mutation: {
    register: async (_, args) => {
      const { name, username, email, password } = args;
      const newUser = { name, username, email, password };
      await UserModel.register(newUser);
      return newUser;
    },
    login: async (_, args) => {
      const { username, password } = args;
      const user = await UserModel.login(username, password);
      console.log(user, "ini user");

      return user;
    },
  },
};

module.exports = { typeDefs, resolvers };
