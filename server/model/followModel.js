const { ObjectId } = require("mongodb");
const database = require("../config/mongo");

class followModel {
  static collection() {
    return database.collection("follows");
  }

  static async checkUserFollow(followerId, followingId) {
    const follow = await this.collection().findOne({
      followerId: new ObjectId(String(followerId)),
      followingId: new ObjectId(String(followingId)),
    });

    return !!follow
  }

  static async create(newFollow) {    
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
