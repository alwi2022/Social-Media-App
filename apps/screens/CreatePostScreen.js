import React, { useState } from "react";
import {
  TextInput,
  Button,
  View,
  StyleSheet,
  Text,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

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

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: ["GetPosts"],
  });

  const handleCreatePost = async () => {
    try {
      const newPost = {
        content,
        tags: tags.split(", ").map((el) => el.trim()),
        imgUrl,
      };

      const result = await createPost({
        variables: newPost,
      });
      Keyboard.dismiss();
      setContent("");
      setImgUrl("");
      setTags("");

      navigation.navigate("Home");
      console.log(result, "createPost");
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        style={styles.input}
        placeholder="Write your post..."
        value={content}
        onChangeText={setContent}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter hashtags"
        value={tags}
        onChangeText={setTags}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter image URL"
        value={imgUrl}
        onChangeText={setImgUrl}
      />
      {loading ? (
        <ActivityIndicator size={"large"} color={"#00C300"} />
      ) : (
        <Button
          title="Create Post"
          onPress={handleCreatePost}
          color="#00C300"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
  },
});
