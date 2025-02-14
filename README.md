Realtime Chat & Social Media App (Line Clone)
Aplikasi ini adalah platform media sosial dan chat real-time yang memungkinkan pengguna untuk membuat postingan, berkomentar, menyukai postingan, serta mengirim pesan secara langsung. Dibangun menggunakan React Native (Expo), Node.js (Express), GraphQL, MongoDB, dan Socket.io untuk pengalaman interaksi yang lancar dan real-time.

🛠 Tech Stack
Frontend (React Native - Expo)
⚡ React Native - Framework untuk aplikasi mobile.
⚡ React Navigation - Navigasi antar halaman.
⚡ Apollo Client - Konsumsi API GraphQL.
⚡ Lottie - Animasi interaktif.
Backend (Node.js - Express)
⚡ Express.js - Framework backend.
⚡ GraphQL (Apollo Server) - API fleksibel untuk komunikasi data.
⚡ MongoDB - Database utama untuk user management & daftar percakapan.
⚡ Socket.io - Implementasi real-time chat.
⚡ Zod - Validasi input.
⚡ JWT (JSON Web Token) - Authentication & Authorization.
🎨 Fitur Utama
✅ User Authentication - Register & login dengan JWT.
✅ Post Management - Buat, edit, hapus, dan like postingan.
✅ Comment System - Berikan komentar pada postingan pengguna lain.
✅ Realtime Chat - Menggunakan Socket.io untuk mengirim dan menerima pesan secara langsung.
✅ Follow System - Hanya bisa mengirim pesan ke pengguna yang sudah di-follow.
✅ UI Minimalis & Responsif - Menggunakan React Native & Expo untuk tampilan yang clean dan smooth.

Cara Menjalankan Proyek
1️⃣ Clone Repository
git clone https://github.com/username/realtime-chat-social-media.git

cd realtime-chat-social-media
2️⃣ Install Dependencies
🔹 Backend
cd server
npm install

🔹 Frontend
cd apps
npm install

3️⃣ Setup Environment Variables
🔹 Backend (.env)
env
PORT=3000
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/mydb
SECRET=your_jwt_secret
SOCKET_PORT=4000

4️⃣ Jalankan Backend & Frontend
🔹 Backend
cd server
npm run dev

🔹 Frontend
cd apps
npm start

📩 Kontak
📧 Email: imambahrialwi21@gmail.com
🌐 LinkedIn: https://www.linkedin.com/in/imam-bahri-alwi-019816250/
