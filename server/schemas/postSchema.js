const { ObjectId } = require("mongodb");
const redis = require("../config/ioRedis");
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
}
`;

const resolvers = {
  Query: {
    getPosts: async (_, args, { authentication }) => {
      await authentication();

      const postRedis = await redis.get("posts");
      if (postRedis) {
        const posts = JSON.parse(postRedis);
        posts.forEach(post => {
          if (post.createdAt) {
            post.createdAt = new Date(post.createdAt);  
          }
        });
        console.log(posts, "post from redis");
        return posts;
      }
      const post = await postModel.getAllPosts();
      redis.set("posts", JSON.stringify(post));
      console.log(post, "post from mongodb");
      return post;
    },

    getPostsById: async (_, { _id },{authentication}) => {      
      await authentication();
      console.log(_id,'ini _id di getpostbyid');
      
      const post = await postModel.getPostById(_id);
      console.log(post,'ini post di getpostbyid');
      
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
      redis.del("posts");
      return newPost;
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
      redis.del("posts");
      return comment;
    },

    addLike: async (_, args, { authentication }) => {
      const user = await authentication();
      const { postId } = args;
      const isLiked = await postModel.checkUserLike(postId, user.username);
      console.log(isLiked);
      
      if (isLiked) {
        await postModel.removeLike(postId, user.username);
        redis.del("posts");
        return "Unliked";
      } else {
        const like = {
          username: user.username,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await postModel.addLike(postId, like);
        redis.del("posts");
        return "Liked";
      }
    },
  },
};
module.exports = { typeDefs, resolvers };
