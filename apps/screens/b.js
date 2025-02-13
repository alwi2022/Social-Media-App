import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useMutation, useQuery, gql } from "@apollo/client";
import io from "socket.io-client";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";

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
  const { chatId, name } = route.params;
  const { data, refetch } = useQuery(GET_MESSAGES);
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
  const [username, setUsername] = useState(""); // ✅ Pastikan username tersimpan sebelum render pertama
  const flatListRef = useRef(null); // 🔥 Gunakan Ref untuk auto-scroll

  useEffect(() => {
    // 🔥 Ambil username yang sedang login dari SecureStore
    const fetchUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };
    fetchUsername();

    // 🔥 Setup Socket.io
    const newSocket = io("https://6813-125-161-140-108.ngrok-free.app");
    setSocket(newSocket);

    newSocket.on("newMessage", (newMsg) => {
      console.log("🔄 Pesan Baru Diterima:", newMsg);
      refetch(); // ✅ Update UI tanpa reload
    });

    return () => newSocket.disconnect();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const { data: newMessageData } = await sendMessage({
        variables: { chatId, content: message },
      });

      const newMessage = newMessageData.sendMessage;

      // ✅ Emit ke server agar semua client mendapat update
      socket.emit("newMessage", newMessage);

      setMessage(""); // Reset input

      // 🔥 Scroll ke pesan terbaru
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef} // 🔥 Gunakan Ref untuk auto-scroll
        data={data?.getChats.find((chat) => chat._id === chatId)?.messages || []}
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
            {/* 🔥 Profile Picture */}
            {item.sender.username !== username && (
              <Image
                source={{
                  uri: `https://avatar.iran.liara.run/public/boy?username=${item.sender.username}`,
                }}
                style={styles.profileImage}
              />
            )}

            <View
              style={[
                styles.messageBubble,
                item.sender.username === username
                  ? styles.myMessage
                  : styles.otherMessage,
              ]}
            >
              <Text style={styles.messageSender}>{item.sender.username}</Text>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          </View>
        )}
        inverted={false} // 🔥 Pastikan pesan terbaru ada di bawah
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          multiline={true} // ✅ Agar input bisa auto-wrap ke bawah
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  myMessageContainer: {
    flexDirection: "row-reverse", // ✅ Mengatur agar pesan saya di kanan
  },
  otherMessageContainer: {
    flexDirection: "row",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#00C300",
    borderTopRightRadius: 0, // 🔥 Buat bubble lebih natural
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderTopLeftRadius: 0, // 🔥 Buat bubble lebih natural
  },
  messageSender: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 20,
    minHeight: 40,
    maxHeight: 100, // ✅ Batasi tinggi agar tetap rapi
  },
  sendButton: {
    backgroundColor: "#00C300",
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});
