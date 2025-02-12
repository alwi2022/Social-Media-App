const { ObjectId } = require("mongodb");
const database = require("../config/mongo");
const { hashPass, comparePass } = require("../helpers/bycrpts");
const { signToken } = require("../helpers/jwt");

class UserModel {
  static collection() {
    return database.collection("users");
  }

  static async register(newUser) {
    if (!newUser.name) {
      throw new Error("name is required");
    }
    if (!newUser.username) {
      throw new Error("username is required");
    }
    if (!newUser.email) {
      throw new Error("Email is required");
    }

    if (!newUser.password) {
      throw new Error("Password is required");
    }

    const emailExist = await this.collection().findOne({
      email: newUser.email,
    });
    const usernameExist = await this.collection().findOne({
      username: newUser.username,
    });

    if (usernameExist) {
      throw new Error("Username must be unique");
    }

    const emailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailformat.test(newUser.email)) {
      throw new Error("invalid email format");
    }

    if (emailExist) {
      throw new Error("Email must be unique");
    }

    if (newUser.password.length < 5) {
      throw new Error("min length password is 5");
    }
    newUser.password = hashPass(newUser.password);

    return this.collection().insertOne(newUser);
  }

  static async login(username, password) {
    if (!username) {
      throw new Error("Username is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }

    const user = await this.collection().findOne({ username });

    if (!user) {
      throw new Error("Invalid username/password");
    }

    const compare = comparePass(password, user.password);

    if (!compare) {
      throw new Error("Invalid username/passowrd");
    }
    const payload = { id: user._id };

    const token = signToken(payload);

    return {
      access_token: token,
      username: user.username,
      user_id: user._id,
    };
  }

  static async getUsername(username, currentUserId) {
    const users = await this.collection()
      .aggregate([
        {
          $match: {
            username: {
              $regex: username || "",
              $options: "i",
            },
          },
        },
        {
          $lookup: {
            from: "follows",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$followingId", "$$userId"] },
                      { $eq: ["$followerId", new ObjectId(currentUserId)] },
                    ],
                  },
                },
              },
            ],
            as: "followInfo",
          },
        },
        {
          $addFields: {
            isFollowing: { $gt: [{ $size: "$followInfo" }, 0] },
          },
        },
        {
          $project: {
            followInfo: 0,
          },
        },
      ])
      .toArray();
  
    return users;
  }
  

  static async findById(_id) {
    const agg = [
      {
        $match: {
          _id: new ObjectId(String(_id)),
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followerId",
          as: "followingDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followingDetails.followingId",
          foreignField: "_id",
          as: "following",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingId",
          as: "followerDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followerDetails.followerId",
          foreignField: "_id",
          as: "followers",
        },
      },
    ];

    const result = await this.collection().aggregate(agg).toArray();
    return result[0];
  }
}

module.exports = UserModel;
