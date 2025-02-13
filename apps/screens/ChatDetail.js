import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useMutation, useQuery, gql } from "@apollo/client";
import io from "socket.io-client";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";
import dayJs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import errorAnimation from "../assets/animations/error.json"; //
import loadingAnimation from "../assets/animations/AnimationAMongus.json";
import LottieView from "lottie-react-native";
// Aktifkan plugin relativeTime untuk Day.js
dayJs.extend(relativeTime);
const GET_MESSAGES = gql`
  query GetChats {
    getChats {
      _id
      messages {
        content
        createdAt
        sender {
          username
        }
      }
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: ID!, $content: String!) {
    sendMessage(chatId: $chatId, content: $content) {
      content
      sender {
        username
      }
      createdAt
    }
  }
`;

export default function ChatDetailScreen({ route }) {
  const { chatId } = route.params;
  const { error, loading, data, refetch } = useQuery(GET_MESSAGES, {
    fetchPolicy: "network-only",
  });
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    update(cache, { data: { sendMessage } }) {
      const existingChats = cache.readQuery({ query: GET_MESSAGES });
      if (existingChats) {
        const updatedChats = existingChats.getChats.map((chat) =>
          chat._id === chatId
            ? { ...chat, messages: [...chat.messages, sendMessage] }
            : chat
        );
        cache.writeQuery({
          query: GET_MESSAGES,
          data: { getChats: updatedChats },
        });
      }
    },
  });

  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };
    fetchUsername();

    const newSocket = io("https://6813-125-161-140-108.ngrok-free.app");
    setSocket(newSocket);

    newSocket.on("newMessage", () => {
      refetch();
    });

    return () => newSocket.disconnect();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const { data } = await sendMessage({
        variables: { chatId, content: message },
      });

      if (data?.sendMessage) {
        socket.emit("newMessage", { chatId, message: data.sendMessage });

        setMessage(""); // Kosongkan input setelah mengirim pesan

        await refetch(); // 🔥 Paksa Apollo mengambil data terbaru
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // if (loading)
  //   return (
  //     <View style={styles.center}>
  //       <LottieView
  //         source={loadingAnimation}
  //         autoPlay
  //         loop
  //         style={styles.lottie}
  //       />
  //       <Text style={styles.loadingText}>
  //         Sorry if you are experiencing this loading ...
  //       </Text>
  //     </View>
  //   );

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

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg",
      }}
      style={styles.container}
    >
      <FlatList
        data={(
          data?.getChats.find((chat) => chat._id === chatId)?.messages || []
        ).filter((message) => message.content && message.sender?.username)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender.username === username
                ? styles.myMessageContainer
                : styles.otherMessageContainer,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                item.sender.username === username
                  ? styles.myMessageBubble
                  : styles.otherMessageBubble,
              ]}
            >
              <Text style={styles.messageText}>{item.content}</Text>
              <Text style={styles.messageTime}>
                {dayJs(Number(item.createdAt)).fromNow()}{" "}
                {/* ✅ Fix waktu relatif */}
              </Text>
            </View>
          </View>
        )}
        inverted={false}
      />

      {/* Input Container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder="Type a message"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  myMessageContainer: {
    alignSelf: "flex-end",
    marginRight: 10,
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 15,
    maxWidth: "75%",
    minWidth: "20%",
    elevation: 2,
  },
  myMessageBubble: {
    backgroundColor: "#06C755",
    borderBottomRightRadius: 0,
  },
  otherMessageBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: "#E6E6E6",
    borderRadius: 25,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#06C755",
    borderRadius: 25,
    padding: 12,
    marginLeft: 10,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  lottie: {
    width: 150,
    height: 150,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
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
