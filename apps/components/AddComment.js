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
import { Feather, FontAwesome5 } from "@expo/vector-icons";

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
      Keyboard.dismiss();
      setComment("");
      await refetch();
    } catch (error) {
      Alert.alert("Error adding comment", error.message);
    }
  };
  return (
    <View style={styles.addCommentContainer}>
      <TextInput
        onChangeText={(text) => setComment(text)}
        value={comment}
        placeholder="Add a comment..."
        style={styles.commentInput}
      />
      {loading ? (
        <ActivityIndicator size="large" color="tomato" />
      ) : (
        <Pressable style={styles.sendButton} onPress={handleSubmit}>
          <FontAwesome5 name="paper-plane" size={20} color="white" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: "#3498db",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  commentInput: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});
