const postModel = require("../model/postModel");
const typeDefs = `#graphql
type Post {
  _id: ID
  authorId: ID
  content: String
  tags: [String]
  imgUrl: String
  comments: [String]
  likes: [String]
  createdAt: String
  updatedAt: String
}

type Query {
  getPosts: [Post]
}

type Mutation {
    createPost(authorId: ID, content: String, tags: [String], imgUrl: String): Post
}
`;

const resolvers = {
  Query: {
    getPosts: async ()=>{
        const post = await postModel.getAllPosts()
        return post
    }
  },

  Mutation: {
    createPost: async (_, args) => {
      const { authorId, content, tags, imgUrl } = args;
      const newPost = { 
        authorId,
         content,
          tags,
           imgUrl,
           comments: [], 
           likes: [],    
           createdAt: new Date().toString(),
           updatedAt: new Date().toString()
         };
         const getIdPost = await postModel.addPost(newPost);
        //  console.log(getIdPost,'ini id dari newpost'); //  insertedId: new ObjectId('6785235fba463bf21e7af354')
         
         newPost._id = getIdPost.insertedId
         return newPost;
    },
  },
};
module.exports = { typeDefs, resolvers };
