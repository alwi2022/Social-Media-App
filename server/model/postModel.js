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
}

module.exports = postModel;
