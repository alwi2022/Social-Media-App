import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, push, onValue, update } from "firebase/database";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// 🔥 Konfigurasi Firebase (Pastikan databaseURL sudah benar)
const firebaseConfig = {
  apiKey: "AIzaSyChvIsaATQGBodZldy6_w_ZZ-NLrVf5UwE",
  authDomain: "fir-chat-97e41.firebaseapp.com",
  databaseURL: "https://fir-chat-97e41-default-rtdb.firebaseio.com", // ✅ Hapus "/" di akhir
  projectId: "fir-chat-97e41",
  storageBucket: "fir-chat-97e41.appspot.com", // ✅ Ganti dengan yang benar
  messagingSenderId: "565503482342",
  measurementId: "G-LLY6Q5LR67",
  appId: "1:565503482342:web:597408224d2137d28fde27",
};

// 🔥 Cek apakah Firebase sudah diinisialisasi untuk menghindari duplikasi
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// **Inisialisasi Database dan Auth**
const db = getDatabase(app);
const auth = getAuth(app);

export {
  db,
  ref,
  push,
  onValue,
  update,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
};
