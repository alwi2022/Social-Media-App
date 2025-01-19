[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=17683544&assignment_repo_type=AssignmentRepo)

# GC01

## My Social Media App

My Social Media App adalah sebuah aplikasi client(mobile)-server. Challenge ini juga merupakan salah satu aplikasi mobile pertama dan terakhir kamu, jadi kerjakan dengan baik sebagai bekal portofolio kamu. Pada challenge ini, kamu diminta untuk membuat aplikasi client(mobile)-server dengan detail sebagai berikut:

### Struktur Folder

- [ ] server: untuk menyimpan aplikasi server GraphQL kamu
- [ ] app: untuk menyimpan aplikasi mobile React Native kamu

### Fitur

- [ ] Fitur Register
- [ ] Fitur Login
- [ ] FItur Add Post
- [ ] Fitur Show Post (berdasarkan yang paling baru)
- [ ] Fitur Comment Post (Embedded Document)
- [ ] Fitur search user berdasarkan nama atau username
- [ ] Fitur follow
- [ ] Menampilkan Followers dan Following dari setiap user (Reference with $lookup)
- [ ] Fitur Like Post
- [ ] Menampilkan total like dari setiap post

module.exports={
apps:[
{
name:"GC-01",
script:"./index.js",
env:{
NODE_ENV:"production",
PORT:80,
SECRET:"secret",
MONGODB_URL:"mongodb+srv://imambahrialwi21:TLLTxAjT1aLfkVrN@cluster0.tjgsf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
REDIS_PASSWORD:"kF0XaIfBEZTMmMGWo8WdHIol5J942S2V",
REDIS_URL:"redis-13643.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com",
},
}
],
};
