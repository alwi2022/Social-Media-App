const { ObjectId } = require("mongodb");
const database = require("../config/mongo");
const { hashPass, comparePass } = require("../helpers/bycrpts");
const { signToken } = require("../helpers/jwt");

class UserModel {
  static collection() {
    return database.collection("users");
  }

  static async register(newUser) {
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
      throw new Error("Username is required");
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
    };
  }

  static async getUsername(username) {
    const users = this.collection()
      .find({
        username: {
          $regex: username || "",
          $options: "i",
        },
      })
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

  static async getFollowing(followerId) {
    const follower = await this.collection()
      .find({ followerId: new ObjectId(String(followerId)) })
      .toArray();
    console.log(follower, "ion folower");

    return follower;
  }
  static async getFollowers(followingId) {
    const following = await this.collection()
      .find({ followingId: new ObjectId(String(followingId)) })
      .toArray();
    console.log(following);

    return following;
  }
}

module.exports = UserModel;
