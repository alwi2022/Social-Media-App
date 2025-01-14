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
}
`;

const resolvers = {
    Mutation: {
        follow: async (_, { followingId }, { authentication }) => {
      
            const user = await authentication(); 
            if (!user) throw new Error("Authentication failed");
      
            const newFollow = {
              followingId,
              followerId: user._id,
            };
      
            console.log("Data to Insert:", newFollow); 
      
            await followModel.create(newFollow);
      
            return "Success follow user";
        
       
        },
      },
      
}


module.exports = { typeDefs, resolvers };