import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { gql, useMutation } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import Modal from "react-native-modal";

const ADD_LIKE = gql`
  mutation AddLike($postId: ID) {
    addLike(postId: $postId)
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost(
    $postId: ID!
    $content: String
    $tags: [String]
    $imgUrl: String
  ) {
    updatePost(
      postId: $postId
      content: $content
      tags: $tags
      imgUrl: $imgUrl
    ) {
      _id
      content
      tags
      imgUrl
    }
  }
`;

const formatRelativeDate = (dateString) => {
  const timestamp = Number(dateString);
  const date = isNaN(timestamp) ? null : new Date(timestamp);
  if (isNaN(date)) {
    return "Invalid date";
  }
  return formatDistanceToNow(date, { addSuffix: true });
};

export default function Postcard({ posts }) {
  const navigation = useNavigation();

  const [like, { loading }] = useMutation(ADD_LIKE, {
    refetchQueries: ["GetPosts"],
  });

  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(posts.content);

  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: ["GetPosts"],
  });

  const [updatePost] = useMutation(UPDATE_POST, {
    refetchQueries: ["GetPosts"],
  });

  const handleDelete = async () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost({ variables: { postId: posts._id } });
            Alert.alert(
              "Post Deleted",
              "The post has been deleted successfully."
            );
            setShowModal(false);
          } catch (error) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  const handleUpdate = async () => {
    try {
      await updatePost({
        variables: { postId: posts._id, content: updatedContent },
      });
      Alert.alert("Post Updated", "The post has been updated successfully.");
      setShowUpdateModal(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: `https://avatar.iran.liara.run/public/boy?username=${posts.authorDetail?.username}`,
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>{posts.authorDetail?.username}</Text>
           <Text style={styles.subText}>{posts.authorDetail?.username === "Alwi" ? "Developer" : "Offcial Account"}</Text>
          </View>
        </View>

        <Pressable onPress={() => setShowModal(true)}>
          <Feather name="more-horizontal" size={20} style={styles.menuIcon} />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.postContent}>{posts.content}</Text>
      </View>

      {/* Post Image */}
      {posts.imgUrl && (
        <Image source={{ uri: posts.imgUrl }} style={styles.postImage} />
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionsLeft}>
          <Pressable
            onPress={() => like({ variables: { postId: posts._id } })}
            disabled={loading}
            style={styles.actionButton}
          >
            <AntDesign
              name="like1"
              size={22}
              color="#007AFF"
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>{posts.likes?.length}</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate("Details", {
                id: posts._id,
                name: posts.content,
              })
            }
            style={styles.actionButton}
          >
            <FontAwesome5 name="comment" size={20} style={styles.actionIcon} />
            <Text style={styles.actionText}>{posts.comments?.length}</Text>
          </Pressable>
        </View>
        <Text style={styles.timeText}>
          {formatRelativeDate(posts.createdAt)}
        </Text>
      </View>

      {/* Modal for Options */}
      <Modal isVisible={showModal} onBackdropPress={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <Pressable
            onPress={() => setShowUpdateModal(true)}
            style={styles.modalButton}
          >
            <Text style={styles.modalText}>Update</Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            style={[styles.modalButton, { backgroundColor: "red" }]}
          >
            <Text style={styles.modalText}>Delete</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Modal for Update */}
      <Modal
        isVisible={showUpdateModal}
        onBackdropPress={() => setShowUpdateModal(false)}
      >
        <View style={styles.updateModalContainer}>
          <Text style={styles.modalTitle}>Update Post</Text>
          <TextInput
            style={styles.input}
            value={updatedContent}
            onChangeText={setUpdatedContent}
            multiline
          />
          <Pressable onPress={handleUpdate} style={styles.modalButton}>
            <Text style={styles.modalText}>Save</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalButton: {
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  modalText: {
    color: "white",
    fontWeight: "bold",
  },
  updateModalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
