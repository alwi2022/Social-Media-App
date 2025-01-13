require("dotenv").config();
const User = require("../model/user");
const db = require("../config/mongo");
const { ObjectId } = require("mongodb");
const usersCollection = db.collection("users");
const typeDefs = `#graphql
    # User type represents each User's properties
    type User {
    _id: ID
    name: String
    username: String
    email: String
  }



  type Token{
  access_token: String
  }

    type Mutation {
    register(name: String!, username: String!, email: String!, password: String!): User
    login(email: String!,password: String!): Token
  }
  `;

const resolvers = {
  Query: {
    searchUser: async (_, { query }) => {
      const users = await usersCollection
        .find({
          $or: [
            { name: { $regex: query, $options: "i" } },
            { username: { $regex: query, $options: "i" } },
          ],
        })
        .toArray();
      return users;
    },
    getUser: async (_, { id }) => {
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
      return user;
    },
  },

  //args akan mendapatkan data yang ada di type query
  //kalo fiedl itu yang after args :
  Mutation: {
    register: async (_, args) => {
      const { name, username, email, password } = args;

      const newUser = await User.register(name, username, email, password);
      return {
        _id: newUser.insertedId,
        name,
        username,
        email,
      };
    },
    login: async (_, args) => {
      const { email, password } = args;
      const user = await User.login(email, password);
      return user;
    },
  },
};

module.exports = { typeDefs, resolvers };
