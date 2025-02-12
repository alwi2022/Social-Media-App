import { StyleSheet, Text, View,  FlatList, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ChatScreen({ navigation }) {
  const [chats, setChats] = useState([
    { id: "1", name: "Key Michelle", lastMessage: "Hai how are u?", profile: `https://avatar.iran.liara.run/public/boy?username=Key Michele`, unread: 2, time: "10:27" },
    { id: "2", name: "Jane Cooper", lastMessage: "Let's have dinner tomorrow night", profile: `https://avatar.iran.liara.run/public/girl?username=Jane cooper`, unread: 1, time: "07:40" },
    { id: "3", name: "Ethan Lee", lastMessage: "Okay", profile: `https://avatar.iran.liara.run/public/boy?username=Ethan Lee`, unread: 0, time: "12:30" },
   
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Semua</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Belum Dibaca</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Favorit</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Grup</Text></TouchableOpacity>
      </View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatRow} onPress={() => navigation.navigate("ChatDetail", { chatId: item.id, name: item.name })}>
            <Image source={{ uri: item.profile }} style={styles.profileImage} />
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{item.name}</Text>
              <Text style={styles.chatMessage}>{item.lastMessage}</Text>
            </View>
            <View style={styles.chatMeta}>
              <Text style={styles.chatTime}>{item.time}</Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.chatList}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => console.log("Add new chat") }>
        <Ionicons name="chatbubble-ellipses" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginBottom  : 15,
    backgroundColor: "#f4f4f4",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#ddd",
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  chatList: {
    paddingBottom: 80,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  chatMessage: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  chatMeta: {
    alignItems: "flex-end",
  },
  chatTime: {
    fontSize: 12,
    color: "#888",
  },
  unreadBadge: {
    backgroundColor: "#00C300",
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  unreadText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#00C300",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});





