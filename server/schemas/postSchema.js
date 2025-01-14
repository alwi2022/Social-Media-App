const postModel = require("../model/postModel");
const typeDefs = `#graphql
type Post {
  _id: ID
  authorId: ID
  content: String
  tags: [String]
  imgUrl: String
  comments: [Comment]
  likes: [Like]
  createdAt: String
  updatedAt: String
}


type Comment {
 username: String
 content: String
 createdAt: String
 updatedAt: String
}


type Like{
  username: String
  createdAt: String
 updatedAt: String
}

type Query {
  getPosts: [Post]
}

type Mutation {
    createPost(authorId: ID, content: String, tags: [String], imgUrl: String): Post
    addComent(postId:ID, username:String,content:String): Comment
}
`;

const resolvers = {
  Query: {
    getPosts: async (_,args,{authentication}) => {
      await authentication()
      const post = await postModel.getAllPosts();
      console.log(post);
      
      return post;
    },
  },

  Mutation: {
    createPost: async (_, args,{authentication}) => {
      await authentication()
      const { authorId, content, tags, imgUrl } = args;
      const newPost = {
        authorId,
        content,
        tags,
        imgUrl,
        comments: [],
        likes: [],
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      };
      const getIdPost = await postModel.addPost(newPost);

      newPost._id = getIdPost.insertedId;
      return newPost;
    },

    addComent: async (_, args,{authentication}) => {
      await authentication()
      const { postId, username, content } = args;
      const comment = {username,content, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()}
      await postModel.addComent(postId,comment)

      return comment
    },
  },
};
module.exports = { typeDefs, resolvers };
