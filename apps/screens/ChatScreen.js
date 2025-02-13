import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import { useEffect, useState, useMemo } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, gql } from "@apollo/client";
import io from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MaterialIcons } from "@expo/vector-icons";
import errorAnimation from "../assets/animations/error.json"; //
import LottieView from "lottie-react-native";
import { Swipeable } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
dayjs.extend(relativeTime); // Untuk format waktu relatif seperti "2 minutes ago"
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

const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: ID!) {
    deleteChat(chatId: $chatId) {
      _id
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
  const { data, refetch, error } = useQuery(GET_CHATS, {
    fetchPolicy: "network-only",
  });
  const [deleteChat] = useMutation(DELETE_CHAT);

  const [createChat] = useMutation(CREATE_CHAT);
  const { data: followedUsers, refetch: refetchFollowedUser } = useQuery(
    GET_FOLLOWED_USERS,
    {
      fetchPolicy: "network-only",
    }
  );
  const [socket, setSocket] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(""); // Menyimpan username yang sedang login
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
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

  useEffect(() => {
    if (modalVisible) {
      refetchFollowedUser();
    }
  }, [modalVisible]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <LottieView
          source={errorAnimation}
          autoPlay
          loop
          style={styles.errorLottie}
        />
        <Text style={styles.errorText}>Oops! Failed to load data.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🔥 Fungsi untuk Membuat Chat Baru
  const handleCreateChat = async (selectedUsername) => {
    setIsCreatingChat(true);
    try {
      const { data } = await createChat({
        variables: { username: selectedUsername },
      });
      if (data.createChat) {
        setModalVisible(false);
        refetch();
        navigation.navigate("ChatDetail", {
          chatId: data.createChat._id,
          name: selectedUsername,
        });
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat({ variables: { chatId } });
      refetch();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const filteredChats = useMemo(() => {
    return (
      data?.getChats
        ?.filter((chat) => chat.users.some((u) => u.username === loggedInUser))
        .sort(
          (a, b) =>
            Number(b.messages[b.messages.length - 1]?.createdAt || 0) -
            Number(a.messages[a.messages.length - 1]?.createdAt || 0)
        ) || []
    );
  }, [data, loggedInUser]);

  return (
    <View style={styles.container}>
      {/* Filter Section */}

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Unread</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Group</Text>
        </TouchableOpacity>
      </View>

      {/* Chat List */}

      {data?.getChats?.length === 0 && (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="chat-bubble-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No conversations yet</Text>
        </View>
      )}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const otherUser = item.users.find((u) => u.username !== loggedInUser);
          if (!otherUser) return null; // Jika tidak ada user lain, jangan tampilkan chat
          const lastMessage = item.messages[item.messages.length - 1];
          const formattedTime = lastMessage
            ? dayjs(Number(lastMessage.createdAt)).fromNow()
            : "";

          return (
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity
                  onPress={() => handleDeleteChat(item._id)}
                  style={styles.deleteSwipe}
                >
                  <MaterialIcons name="delete" size={24} color="white" />
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                style={styles.chatRow}
                onPress={() =>
                  navigation.navigate("ChatDetail", {
                    chatId: item._id,
                    name: otherUser.username,
                  })
                }
              >
                <Image
                  source={{
                    uri: `https://avatar.iran.liara.run/public/boy?username=${otherUser.username}`,
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.chatInfo}>
                  <Text style={styles.chatName}>{otherUser.username}</Text>
                  <View style={styles.messageRow}>
                    <Text
                      style={[
                        styles.chatMessage,
                        lastMessage ? styles.boldText : null,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {lastMessage
                        ? `${lastMessage.content.substring(0, 30)}${
                            lastMessage.content.length > 30 ? "..." : ""
                          }`
                        : "No messages yet"}
                    </Text>
                    {lastMessage && (
                      <Text style={styles.timestamp}>
                        {" "}
                        {lastMessage
                          ? dayjs(Number(lastMessage.createdAt)).format("HH:mm")
                          : ""}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          );
        }}
      />

      {/* Button to Create Chat */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses" size={30} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a user to chat</Text>
          {isCreatingChat && <ActivityIndicator size="large" color="#00C300" />}

          {followedUsers?.getFollowedUsers?.length === 0 && (
            <View style={styles.modalEmptyContainer}>
              <MaterialIcons name="person-off" size={80} color="#ccc" />
              <Text style={styles.modalEmptyText}>No users available</Text>
            </View>
          )}
          <FlatList
            data={followedUsers?.getFollowedUsers || []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userRow}
                onPress={() => handleCreateChat(item.username)}
              >
                <Image
                  source={{
                    uri: `https://avatar.iran.liara.run/public/boy?username=${item.username}`,
                  }}
                  style={styles.profileImage}
                />
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
    backgroundColor: "#ffffff",
  },
  deleteSwipe: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: "100%",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Efek transparan
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    backgroundColor: "red",
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
    top: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 20,
    margin: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  createButton: {
    backgroundColor: "#00C300",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  messageRow: {
    flexDirection: "row", // 🔥 Biar sejajar
    justifyContent: "space-between", // 🔥 Pisahkan pesan dan waktu
    alignItems: "center", // 🔥 Posisikan rata tengah
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
    marginLeft: 8, // 🔥 Beri jarak agar tidak mepet
  },

  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginBottom: 15,
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
    flex: 1,
    paddingRight: 40,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    position: "absolute",
    top: -10, // Mengangkat sedikit ke atas
    right: 2, //
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

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },

  modalEmptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  modalEmptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorLottie: {
    width: 200,
    height: 200,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff5555",
    marginTop: 10,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#ff5555",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
