const Redis = require("ioredis");
const redis = new Redis({
  port: 13643, // Redis port
  host: "redis-13643.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com",
  username: "default", // needs Redis >= 6
  password: "kF0XaIfBEZTMmMGWo8WdHIol5J942S2V",
  db: 0, // Defaults to 0
});

module.exports = redis;
