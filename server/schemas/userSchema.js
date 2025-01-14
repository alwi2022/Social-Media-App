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
  }

  type Query {
        getUserById(_id: ID): User
        getUserByUserName(username:String): [User]
        following(followerId: ID): [FollowUser]
        followers(followingId: ID): [FollowUser]
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
      const user = await UserModel.findById(_id);
      return user;
    },

    getUserByUserName: async (_, args) => {
      const { username } = args;
      const result = await UserModel.getUsername(username);
      if (!username) {
        throw new Error("username is not found");
      }
      return result;
    },

     // Dapatkan daftar pengguna yang diikuti
     following: async (_, { followerId }, { authentication }) => {
      await authentication();
      const following = await UserModel.getFollowing(followerId);
      return following;
    },

    // Dapatkan daftar pengguna yang menjadi follower
    followers: async (_, { followingId }, { authentication }) => {
      await authentication();
      const followers = await UserModel.getFollowers(followingId);
      return followers;
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
      return user;
    },
  },
};

module.exports = { typeDefs, resolvers };
