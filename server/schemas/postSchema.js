const { ObjectId } = require("mongodb");
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
  authorDetail: AuthorDetail
}

type AuthorDetail{
  _id:ID
  username: String
  email: String
  name: String
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
  getPostsById(_id:ID): Post
}

type Mutation {
    createPost(content: String, tags: [String], imgUrl: String): Post
    addComent(postId:ID, content:String): Comment
    addLike(postId:ID): String
    deletePost(postId:ID): String
    updatePost(postId:ID, content:String, tags:[String], imgUrl:String): Post
}
`;

const resolvers = {
  Query: {
    getPosts: async (_, args, { authentication }) => {
      await authentication();
      const post = await postModel.getAllPosts();
      return post;
    },

    getPostsById: async (_, { _id }, { authentication }) => {      
      await authentication();
      console.log(_id, 'ini _id di getpostbyid');
      
      const post = await postModel.getPostById(_id);
      console.log(post, 'ini post di getpostbyid');
      
      return post;
    },
  },

  Mutation: {
    createPost: async (_, args, { authentication }) => {
      const user = await authentication();
      const { content, tags, imgUrl } = args;
      const newPost = {
        authorId: user._id,
        content,
        tags,
        imgUrl,
        comments: [],
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const getIdPost = await postModel.addPost(newPost);
      newPost._id = getIdPost.insertedId;
      return newPost;
    },

    deletePost: async (_, args, { authentication }) => {
      const user = await authentication();
      const { postId } = args;
      const post = await postModel.getPostById(postId);
      if (post.authorId.toString() !== user._id.toString()) {
        throw new Error("Not authorized");
      }
      await postModel.deletePost(postId);
      return "Post deleted";
    },

    updatePost: async (_, args, { authentication }) => {
      const user = await authentication();
      const { postId, content, tags, imgUrl } = args;
      const post = await postModel.getPostById(postId);
    
      if (!post) {
        throw new Error("Post not found");
      }
    
      if (post.authorId.toString() !== user._id.toString()) {
        throw new Error("Not authorized");
      }
    
      const updatePost = {
        content,
        tags,
        imgUrl,
        updatedAt: new Date(),
      };
    
      await postModel.updatePost(postId, updatePost);
    
      // Ambil data terbaru setelah update
      const updatedPost = await postModel.getPostById(postId);
      return updatedPost;
    },
    

    addComent: async (_, args, { authentication }) => {
      const user = await authentication();
      const { postId, content } = args;
      const comment = {
        username: user.username,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await postModel.addComent(postId, comment);
      return comment;
    },

    addLike: async (_, args, { authentication }) => {
      const user = await authentication();
      const { postId } = args;
      const isLiked = await postModel.checkUserLike(postId, user.username);
      
      if (isLiked) {
        await postModel.removeLike(postId, user.username);
        return "Unliked";
      } else {
        const like = {
          username: user.username,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await postModel.addLike(postId, like);
        return "Liked";
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
