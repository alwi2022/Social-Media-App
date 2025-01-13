const { ObjectId } = require("mongodb");
const database = require("../config/mongo");
const { hashPass, comparePass } = require("../helpers/bycrpts");
const { signToken } = require("../helpers/jwt");

class UserModel {
  static collection() {
    return database.collection("users");
  }

  static async register(newUser) {
    console.log(newUser,'ini newuser id resiter model');
    
    const emailExist = await this.collection().findOne({
      email: newUser.email,
    });
    const usernameExist = await this.collection().findOne({
      username: newUser.username,
    });

    if (usernameExist) {
      throw new Error("Username must be unique");
    }

    if (emailExist) {
      throw new Error("Email must be unique");
    }

    if (newUser.password.length < 5) {
      throw new Error("min length password is 5");
    }
    newUser.password = hashPass(newUser.password);
    console.log(newUser, "ini newusre`");

    return  this.collection().insertOne(newUser);
  }

  static async login(email, password) {
    if (!email) {
      throw new Error("Email is required");
    }
    if (!password) {
      throw new Error("Email is required");
    }

    const user = await this.collection().findOne({ email });

    if (!user) {
      throw new Error("Invalid email password");
    }

    const compare = comparePass(password, user.password);

    if (!compare) {
      throw new Error("Invalid email passowrd");
    }
    const payload = { id: user._id, email: user.email };

    const token = signToken(payload);

    return {
      access_token: token,
    };
  }

  static async getUserById(_id) {
    const user = await this.collection().findOne({
      _id: new ObjectId(toString(id)),
    });
    return user;
  }
}

module.exports = UserModel;
