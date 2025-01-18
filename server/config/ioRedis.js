const Redis = require("ioredis");
const redis = new Redis({
  port: 13643, // Redis port
  host: process.env.REDIS_URL,
  username: "default", // needs Redis >= 6
  password: process.env.REDIS_PASSWORD,
  db: 0, // Defaults to 0
});

module.exports = redis;
