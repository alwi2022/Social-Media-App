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

      const existingFollow = await followModel.checkUserFollow(
        user._id,
        followingId
      );

      if (existingFollow) {
        return "You already follow this user";
      } else {
        const newFollow = {
          followingId,
          followerId: user._id,
        };
        const result = await followModel.create(newFollow);
        return "follow";
      }
    },

    unfollow: async (_, { followingId }, { authentication }) => {
      const user = await authentication();
      if (String(user._id) === followingId) {
        throw new Error("You cannot Unfoll yourself");
      }


      const existingFollow = await followModel.checkUserFollow(
        user._id,
        followingId
      );

      if (!existingFollow) {
        return "You already unfollow this user";
      } else {
        await followModel.delete(user._id, followingId);
        return "unfollow";
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
