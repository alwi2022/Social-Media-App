# Journey

## Day 1

### Setup Project: Tema Aplikasi, Apollo Server, GraphQL
Silahkan setup project aplikasi server kamu:
- [V] Install MongoDB database pada komputer kamu atau menggunakan MongoDB Atlas
- [V] Install package yang dibutuhkan: @apollo/server, graphql dan mongodb sebagai MongoDB driver
- [V] Pilih tema sesuai dengan pilihan dan kesepakatan instructor, tuliskan dalam README github kamu
- [V] Buatlah aplikasi server GraphQL menggunakan Apollo Server dengan PORT default: 3000


### GraphQL - Apollo Server
Buatlah Aplikasi server GraphQL dengan menggunakan Apollo Server yang memiliki fungsi sebagai berikut:
- [V] Register (Mutation)
- [V] Login (Query)
- [V] Get Post (Query)
- [V] Add Post (Mutation)
- [V] Comment Post (Mutation)
- [V] Search User (Query)
- [V] Follow (Mutation)
- [V] Get User (Query)
- [V] Like Post (Mutation)

### MongoDB 1
Buatlah fungsi/method pada aplikasi server GraphQL kamu yang menghubungkan dengan database MongoDB dengan fungsi sebagai berikut:
- [V] Add user: untuk kebutuhan register
- [V] Get user by username dan password: untuk kebutuhan login
- [V] Search users by name/username: untuk kebutuhan mencari user berdasarkan nama atau username
- [V] Follow User: untuk kebutuhan memfollow user
- [V] Get User by Id: untuk menampilkan profile user
- [V] Add Post: untuk menambahkan post baru
- [V] Get Posts: mengambil daftar post berdasarkan yang terbaru
- [V] Get Post by Id: mengambil post berdasarkan id
- [V] Comment Post: untuk menambahkan komentar pada post
- [V] Like Post: untuk menambahkan like pada post


## Day 2

### MongoDB 2
Buatlah lookup/relasi pada method/fungsi yang berhubungan dengan MongoDB yang sudah kamu buat dengan rincian sebagai berikut:
- [V] Get Post by Id: mengambil post berdasarkan id
  - [V] Menampilkan nama/username user pada data komentar

- [V] Get User by Id: untuk menampilkan profile user
  - [V] Menampilkan list nama/username user follower
  - [V] Menampilkan list nama/username user following


### Redis - Cache
Implementasikan cache pada aplikasi GraphQL server yang sudah dibuat dengan detail sebagai berikut:
- [V] Implementasikan cache pada Get Post (Query)
- [V] Invalidate cache pada Add Post (Mutation)

## Day 3
### React Native
Buatlah aplikasi mobile React-Native dengan menggunakan expo. Aplikasi ini adalah client side dari challenge My Social Media App.
Pada aplikasi ini kamu perlu membuat screen sebagai berikut:
- [V] Unauthenticate screen
  - [V] Login Screen: Menampilkan form untuk login
  - [V] Register Screen: Menampilkan form untuk register

- [V] Authenticate screen
  - [V] Home screen: Menampilkan list post
  - [V] Create Post: Menampilkan form untuk menambahkan post baru
  - [V] Post Detail Screen: Menampilkan post detail berdasarkan id dan form untuk komentar
  - [V] Search Screen: Menampilkan form pencarian untuk mencari user (bisa digabung dengan screen lain)
  - [V] Profile Screen: Menampilkan profile user berdasarkan id, serta menampilkan jumlah followings dan followers user.


### React Navigation
 - [V] Implementasikan navigasi pada screen yang sudah kamu buat dengan menggunakan React Navigation.


## Day 4
### GraphQL - Apollo Client
Lakukan komunikasi Aplikasi Mobile (react-native) menggunakan apollo client ke server GraphQL  yang sudah dibuat. Dan Implementasikan query dan mutation sesuai dengan kebutuhan.
- [V] Register (Mutation)
- [V] Login (Query)
- [V] Get Post (Query)
- [V] Add Post (Mutation)
- [V] Comment Post (Mutation)
- [V] Search User (Query)
- [V] Follow (Mutation)
- [V] Get User (Query)
- [V] Like Post (Mutation)

