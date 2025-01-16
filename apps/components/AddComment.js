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
      console.log(error.message);
    }
  };
  return (
    <View style={{ padding: 10, paddingTop: 4 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <TextInput
          onChangeText={{ setComment }}
          value={comment}
          style={styles.input}
        >
          {loading && <ActivityIndicator size={"large"} color={"tomato"} />}

          {loading && (
            <Pressable onPress={handleSubmit}>
              <Feather name="send" size={24} color="black" />
            </Pressable>
          )}
        </TextInput>
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
