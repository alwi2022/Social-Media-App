const { GraphQLError } = require("graphql");
const database = require("../config/mongo");
const { hashPass, comparePass } = require("../helpers/bycrpts");
const { signToken } = require("../helpers/jwt");
class User {
  static async getDatabase() {
    return database.collection("users");
  }

  static async register(name, username, email, password) {
    const usersCollection = await this.getDatabase();
    const emailExist = await usersCollection.findOne({ email });
    if (emailExist) {
      const message = "Email must be unique";
      throw new GraphQLError(message, {
        extensions: {
          code: "BAD_REQUEST",
          http: {
            status: 400,
          },
        },
      });
    }

    if (password.length < 5) {
        throw new GraphQLError("Password must be at least 5 characters long", {
          extensions: {
            code: "BAD_REQUEST",
            http: { status: 400 },
          },
        });
      }
    const hashedPassword = hashPass(password);
    console.log(hashedPassword);
    
    const newUser = await usersCollection.insertOne({
      name,
      username,
      email,
      password: hashedPassword,
    });
    return newUser;
  }

  static async login(email, password) {
    const usersCollection = await this.getDatabase();
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
        throw new GraphQLError("Invalid email/password", {
          extensions: {
            code: "FORBIDDEN",
            http: { status: 401 },
          },
        });
      }

    const compare = comparePass(password, user.password);
    
    if (!compare) {
        throw new GraphQLError("Invalid email/password", {
          extensions: {
            code: "FORBIDDEN",
            http: { status: 401 },
          },
        });
      }
    const payload = { id: user._id, email: user.email };

    const token = signToken(payload);

    return {
      access_token: token,
    };
  }
}

module.exports = User;
