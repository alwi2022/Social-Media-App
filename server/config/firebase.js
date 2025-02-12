const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json"); // Sesuaikan path-nya

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-chat-97e41-default-rtdb.firebaseio.com",
});

const db = admin.database();

module.exports = db;


