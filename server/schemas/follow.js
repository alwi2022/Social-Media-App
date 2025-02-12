const followModel = require("../model/followModel");

const typeDefs = `#graphql

type Follow {
    _id: ID
    followerId: ID
    followingId: ID
    createdAt: String
    updatedAt: String
}

type FollowResponse {
  message: String
  isFollowing: Boolean
}



type Mutation{
    toggleFollow(followingId: ID!): FollowResponse
}
`;

const resolvers = {
  Mutation: {
    async toggleFollow(_, { followingId }, { authentication }) {
      const user = await authentication();
      if (!user) throw new Error("Not authenticated");

      return await followModel.toggleFollow(user._id, followingId);
    },
  },
};

module.exports = { typeDefs, resolvers };
