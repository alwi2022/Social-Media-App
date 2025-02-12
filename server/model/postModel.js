const { ObjectId } = require("mongodb");
const database = require("../config/mongo");
class postModel {
  static collection() {
    return database.collection("posts");
  }

  static async addPost(newPost) {
    const result = await this.collection().insertOne(newPost);
    return result;
  }

  static async deletePost(_id) {
    const result = await this.collection().deleteOne({ _id: new ObjectId(String(_id)) });
    return result;
  }


  static async updatePost(_id, updatePost) {
    const result = await this.collection().updateOne(
      { _id: new ObjectId(String(_id)) },
      { $set: updatePost }
    );
    return result;
  }


  static async getAllPosts() {
    const agg = [
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authorDetail",
        },
      },
      {
        $unwind: {
          path: "$authorDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "authorDetail.password": false,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
    ];
    const result = await this.collection().aggregate(agg).toArray();
    console.log(result, "ini result getpostALl");

    return result;
  }

  static async getPostById(_id) {
    const agg = [
      { $match: { _id: new ObjectId(String(_id)) } },
      {
        $addFields: {
          authorId: { $toObjectId: "$authorId" }, 
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authorDetail",
        },
      },
      {
        $unwind: {
          path: "$authorDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "authorDetail.password": false,
        },
      },
    ];
    const result = await this.collection().aggregate(agg).toArray();

    return result[0];
  }

  static async addComent(postId, comment) {
    const result = await this.collection().updateOne(
      { _id: new ObjectId(String(postId)) },
      { $push: { comments: comment } }
    );
    return result;
  }

  static async checkUserLike(postId, username) {
    const post = await this.collection().findOne({
      _id: new ObjectId(String(postId)),
      likes: { $elemMatch: { username } },
    });
    console.log(post,'ini check');
    
    return !!post
  }

  static async removeLike(postId, username) {
    const result = await this.collection().updateOne(
      { _id: new ObjectId(String(postId)) },
      { $pull: { likes: { username } } } 
    );
    return result;
  }

  static async addLike(postId, like) {
    const result = await this.collection().updateOne(
      { _id: new ObjectId(String(postId)) },
      { $push: { likes: like } }    );
    return result;
  }
}

module.exports = postModel;
