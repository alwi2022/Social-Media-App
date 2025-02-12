import { db, ref, push, onValue } from "./firebaseConfig";

// Menyimpan pesan ke Firebase
export const sendMessage = (chatId, senderId, text) => {
  const chatRef = ref(db, `chats/${chatId}/messages`);
  push(chatRef, {
    senderId,
    text,
    timestamp: Date.now(),
  });
};

// Mendengarkan pesan secara real-time
export const listenForMessages = (chatId, callback) => {
  const chatRef = ref(db, `chats/${chatId}/messages`);
  return onValue(chatRef, (snapshot) => {
    const data = snapshot.val() || {};
    const messages = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
    callback(messages);
  });
};

// Mendapatkan daftar chat untuk user tertentu
export const listenForChats = (userId, callback) => {
  const userChatsRef = ref(db, `userChats/${userId}`);
  return onValue(userChatsRef, (snapshot) => {
    const data = snapshot.val() || {};
    const chatList = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
    callback(chatList);
  });
};
