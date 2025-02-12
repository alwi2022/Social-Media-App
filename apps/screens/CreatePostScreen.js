import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";

const CREATE_POST = gql`
  mutation CreatePost($content: String, $tags: [String], $imgUrl: String) {
    createPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
      _id
      content
      tags
      imgUrl
      createdAt
    }
  }
`;

export default function CreatePostScreen() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const navigation = useNavigation();

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    refetchQueries: ["GetPosts"],
  });

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Toast.show({
        type: "error",
        text1: "Post Failed",
        text2: "Content is required!",
        position: "top",
        visibilityTime: 2500,
        autoHide: true,
        topOffset: 10,
      });
      return;
    }

    if (!tags.trim()) {
      Toast.show({
        type: "error",
        text1: "Post Failed",
        text2: "Tags are required!",
        position: "top",
        visibilityTime: 2500,
        autoHide: true,
        topOffset: 10,
      });
      return;
    }

    if (!imgUrl.trim()) {
      Toast.show({
        type: "error",
        text1: "Post Failed",
        text2: "Image URL is required!",
        position: "top",
        visibilityTime: 2500,
        autoHide: true,
        topOffset: 10,
      });
      return;
    }
    try {
      const newPost = {
        content,
        tags: tags.split(",").map((el) => el.trim()),
        imgUrl,
      };

      await createPost({
        variables: newPost,
      });

      Keyboard.dismiss();
      setContent("");
      setImgUrl("");
      setTags("");

      Toast.show({
        type: "success",
        text1: "Post Created",
        text2: "Your post has been successfully added!",
        position: "top",
        visibilityTime: 2500,
        autoHide: true,
        topOffset: 10,
      });

      navigation.navigate("Home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Post Failed",
        text2: error.message,
        position: "top",
        visibilityTime: 2500,
        autoHide: true,
        topOffset: 10,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Toast />
      
      {/* Header Animasi */}
      <View style={styles.header}>
        <LottieView source={require("../assets/animations/Lamp.json")} autoPlay loop style={styles.logo} />
        <Text style={styles.headerText}>Create Post</Text>
      </View>

      {/* Form Container */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Enter hashtags (comma separated)"
          value={tags}
          onChangeText={setTags}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter image URL"
          value={imgUrl}
          onChangeText={setImgUrl}
        />

        {/* Tombol Create Post */}
        {loading ? (
          <ActivityIndicator size={"large"} color={"#00C300"} />
        ) : (
          <TouchableOpacity style={styles.createButton} onPress={handleCreatePost}>
            <Text style={styles.createButtonText}>Create Post</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    paddingTop: 50,
  },
  header: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#00C300",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
