import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, TextInput, Alert, Modal } from "react-native";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, gql } from "@apollo/client";
import io from "socket.io-client";
import * as SecureStore from "expo-secure-store";

const GET_CHATS = gql`
  query GetChats {
    getChats {
      _id
      users {
        _id
        username
      }
      messages {
        content
        sender {
          username
        }
        createdAt
      }
    }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat($username: String!) {
    createChat(username: $username) {
      _id
      users {
        username
      }
      messages {
        content
      }
    }
  }
`;

const GET_FOLLOWED_USERS = gql`
  query GetFollowedUsers {
    getFollowedUsers {
      _id
      username
    }
  }
`;

export default function ChatScreen() {
  const navigation = useNavigation();
  const { data, refetch } = useQuery(GET_CHATS);
  const { data: followedUsers } = useQuery(GET_FOLLOWED_USERS);
  const [createChat] = useMutation(CREATE_CHAT);
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const storedUsername = await SecureStore.getItemAsync("username");
      if (storedUsername) {
        setLoggedInUser(storedUsername);
      }
    };

    fetchLoggedInUser();

    const newSocket = io("https://6813-125-161-140-108.ngrok-free.app");
    setSocket(newSocket);

    newSocket.on("newMessage", () => {
      refetch();
    });

    return () => newSocket.disconnect();
  }, []);

  const handleCreateChat = async (selectedUsername) => {
    try {
      const { data } = await createChat({ variables: { username: selectedUsername } });
      if (data.createChat) {
        setModalVisible(false);
        refetch();
        navigation.navigate("ChatDetail", { chatId: data.createChat._id, name: selectedUsername });
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chats</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#555" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={data?.getChats?.filter(chat => chat.users.some(u => u.username === loggedInUser)) || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const otherUser = item.users.find(u => u.username !== loggedInUser);
          if (!otherUser) return null;

          return (
            <TouchableOpacity
              style={styles.chatRow}
              onPress={() => navigation.navigate("ChatDetail", { chatId: item._id, name: otherUser.username })}
            >
              <Image source={{ uri: `https://avatar.iran.liara.run/public/boy?username=${otherUser.username}` }} style={styles.profileImage} />
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{otherUser.username}</Text>
                <Text style={styles.chatMessage}>{item.messages.length > 0 ? item.messages[item.messages.length - 1].content : "No messages yet"}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Modal for selecting users */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a user to chat</Text>
          <FlatList
            data={followedUsers?.getFollowedUsers || []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.userRow} onPress={() => handleCreateChat(item.username)}>
                <Text style={styles.userText}>{item.username}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.closeModal}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
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
  },
  chatMessage: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userText: {
    fontSize: 16,
  },
  closeModal: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
});
