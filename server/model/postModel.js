const { ObjectId } = require("mongodb");
const database = require("../config/mongo");
class postModel {
  static collection() {
    return database.collection("posts");
  }

  static async addPost(newPost) {
    const result = await this.collection().insertOne(newPost)
    return result
  }

  static async getAllPosts() {
    const result = await this.collection().find().sort({ createdAt: -1 }).toArray()
    return result
  }


  static async addComent(postId,comment){
    const result = await this.collection().updateOne({_id: new ObjectId(String(postId))},{$push:{comments: comment}})
    return result
  }

  static async addLike(postId,like){
    const result = await this.collection().updateOne({_id: new ObjectId(String(postId))},{$push:{likes:like}})
    return result
  }
}

module.exports = postModel;
