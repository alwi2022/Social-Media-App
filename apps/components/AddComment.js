import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const ADD_COMMENT = gql`
  mutation AddComent($postId: ID, $content: String) {
    addComent(postId: $postId, content: $content) {
      username
      content
      createdAt
      updatedAt
    }
  }
`;

export default function AddComment({ postId, refetch }) {
  const [comment, setComment] = useState("");
  const [AddComment, { loading }] = useMutation(ADD_COMMENT);

  const handleSubmit = async () => {
    try {
      await AddComment({
        variables: {
          postId: postId,
          content: comment,
        },
      });
      Alert.alert("Succes add new comment");
      Keyboard.dismiss();
      setComment("");
      await refetch();
    } catch (error) {
      Alert.alert("Error adding comment", error.message);
    }
  };
  return (
    <View style={{ padding: 10, paddingTop: 4 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <TextInput
          onChangeText={(text) => setComment(text)}
          value={comment}
          style={styles.input}
        />
        {loading ? (
          <ActivityIndicator size="large" color="tomato" />
        ) : (
          <Pressable onPress={handleSubmit}>
            <Feather name="send" size={24} color="black" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
  },
});
