const followModel = require("../model/followModel");

const typeDefs = `#graphql

type Follow {
    _id: ID
    followerId: ID
    followingId: ID
    createdAt: String
    updatedAt: String
}


type Mutation{
    follow(followingId: ID): String
    unfollow(followingId: ID): String
}
`;

const resolvers = {
  Mutation: {
    follow: async (_, { followingId }, { authentication }) => {
      const user = await authentication();
      if (String(user._id) === followingId) {
        throw new Error("You cannot follow yourself");
      }

      const newFollow = {
        followingId,
        followerId: user._id,
      };
      await followModel.create(newFollow);

      return "Success follow user";
    },


    unfollow: async (_, { followingId }, { authentication }) => {
      const user = await authentication();
      const result = await followModel.delete(user._id, followingId);
      if (result.deletedCount === 0) {
        throw new Error("yourenot follow this user");
      }

      return "Success unfollow user";
    },
  },
};

module.exports = { typeDefs, resolvers };
