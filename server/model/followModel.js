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
    return !!follow;
  }

  static async toggleFollow(followerId, followingId) {
    const isFollowing = await this.checkUserFollow(followerId, followingId);

    if (isFollowing) {
      await this.collection().deleteOne({
        followerId: new ObjectId(String(followerId)),
        followingId: new ObjectId(String(followingId)),
      });
      return { message: "Unfollowed", isFollowing: false };
    } else {
      await this.collection().insertOne({
        followerId: new ObjectId(String(followerId)),
        followingId: new ObjectId(String(followingId)),
        createdAt: new Date(),
      });
      return { message: "Followed", isFollowing: true };
    }
  }


}

module.exports = followModel;
