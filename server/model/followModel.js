const { ObjectId } = require("mongodb");
const database = require("../config/mongo");

class followModel {
  static collection() {
    return database.collection("follows");
  }

  static async create(newFollow) {
    console.log(newFollow,'ini newfolow');
    
    newFollow.followingId = new ObjectId(String(newFollow.followingId));

    return this.collection().insertOne(newFollow);
  }

  static async delete(followerId, followingId) {
    return this.collection().deleteOne({
      followerId: new ObjectId(String(followerId)),
      followingId: new ObjectId(String(followingId)),
    });
  }
}

module.exports = followModel;
