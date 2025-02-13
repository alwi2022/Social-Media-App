import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { gql, useMutation } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Modal from "react-native-modal";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
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
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(posts.content);
  const [updatedTags, setUpdatedTags] = useState(posts.tags.join(", "));
  const [updatedImgUrl, setUpdatedImgUrl] = useState(posts.imgUrl);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [like, { loading }] = useMutation(ADD_LIKE, {
    refetchQueries: ["GetPosts"],
  });

  const handleLike = async (postId) => {
    try {
      await like({
        variables: { postId },
      });
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorModal(true);
    }
  };

  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: ["GetPosts"],
  });

  const [updatePost] = useMutation(UPDATE_POST, {
    refetchQueries: ["GetPosts"],
  });

  const handleDelete = async () => {
    setLoadingAction(true);
    try {
      await deletePost({ variables: { postId: posts._id } });

      setShowDeleteModal(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorModal(true);
    } finally {
      setLoadingAction(false);
      setShowDeleteModal(false);
    }
  };

  const handleUpdate = async () => {
    setLoadingAction(true);
    try {
      const finalImgUrl =
        updatedImgUrl.trim() === "" ? posts.imgUrl : updatedImgUrl;

      await updatePost({
        variables: {
          postId: posts._id,
          content: updatedContent,
          tags: updatedTags.split(",").map((el) => el.trim()),
          imgUrl: finalImgUrl, // Gunakan nilai terakhir
        },
      });

      // Tambahkan delay agar modal tidak glitch
      setTimeout(() => {
        setShowUpdateModal(false);
      }, 500);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorModal(true);
    } finally {
      setLoadingAction(false);
      setShowUpdateModal(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}

      <Modal
        isVisible={showErrorModal}
        onBackdropPress={() => setShowErrorModal(false)}
        animationIn="shake"
      >
        <View style={styles.errorModal}>
          <MaterialIcons name="error-outline" size={50} color="red" />
          <Text style={styles.errorTitle}>Access Denied</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <Pressable
            style={styles.errorButton}
            onPress={() => setShowErrorModal(false)}
          >
            <Text style={styles.errorButtonText}>OK</Text>
          </Pressable>
        </View>
      </Modal>

      <Modal
        isVisible={showDeleteModal}
        onBackdropPress={() => !loadingAction && setShowDeleteModal(false)}
      >
        <View style={styles.modalContainer}>
          <MaterialIcons name="delete" size={50} color="red" />
          <Text style={styles.modalTitle}>Delete Post</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to delete this post?
          </Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setShowDeleteModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={loadingAction}
            >
              {loadingAction ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.deleteText}>Delete</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

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
            <Text style={styles.subText}>
              {posts.authorDetail?.username === "Alwi"
                ? "Developer"
                : "Offcial Account"}
            </Text>
          </View>
        </View>

        <Pressable onPress={() => setShowModal(true)}>
          <Feather name="more-horizontal" size={20} style={styles.menuIcon} />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.postContent} numberOfLines={2}>
          {posts.content}
        </Text>
      </View>

      {/* Post Image */}
      <TouchableOpacity onPress={() => navigation.navigate("Details", { id: posts._id, name: posts.content })}>

      {posts.imgUrl && (
        <Image source={{ uri: posts.imgUrl }} style={styles.postImage}  />
      )}
      </TouchableOpacity>


      {/* Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionsLeft}>
          <Pressable
            onPress={() => handleLike(posts._id)}
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

          <Pressable style={styles.actionButton}>
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color={"#888"}
              style={styles.actionIcon}
            />
          </Pressable>
        </View>
        <Text style={styles.timeText}>
          {formatRelativeDate(posts.createdAt)}
        </Text>
      </View>

      {/* Modal untuk Opsi */}
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        backdropOpacity={0.5}
      >
        <View style={styles.modalContainer}>
          <Pressable
            onPress={() => {
              setShowModal(false);
              setTimeout(() => setShowUpdateModal(true), 200);
            }}
            style={styles.modalButton}
          >
            <Text style={styles.modalText}>Update</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setShowModal(false);
              setTimeout(() => setShowDeleteModal(true), 200);
            }}
            style={[styles.modalButton, { backgroundColor: "red" }]}
          >
            <Text style={styles.modalText}>Delete</Text>
          </Pressable>
        </View>
      </Modal>

      {/* //showUpdateModal */}
      <Modal
        isVisible={showUpdateModal}
        onBackdropPress={() => setShowUpdateModal(false)}
      >
        <View style={styles.modalContainer}>
          <MaterialIcons name="edit" size={50} color="blue" />
          <Text style={styles.modalTitle}>Update Post</Text>
          <TextInput
            style={styles.input}
            value={updatedContent}
            onChangeText={setUpdatedContent}
            placeholder="Update content..."
            multiline
          />
          <TextInput
            style={styles.input}
            value={updatedTags}
            onChangeText={setUpdatedTags}
            placeholder="Update tags..."
            multiline
          />
          <TextInput
            style={styles.input}
            value={updatedImgUrl}
            onChangeText={setUpdatedImgUrl}
            placeholder="Update image URL..."
            multiline
          />
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setShowUpdateModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.updateButton}
              onPress={handleUpdate}
              disabled={loadingAction}
            >
              {loadingAction ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.updateText}>Save</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    marginTop: 15,
  },

  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },

  updateButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  updateText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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

  username: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  subText: {
    fontSize: 12,
    color: "#888",
  },
  menuIcon: {
    color: "#888",
  },
  contentContainer: {
    marginBottom: 10,
  },
  postContent: {
    fontSize: 15,
    color: "#444",
    marginBottom: 10,
    lineHeight: 22,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  actionsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  actionIcon: {
    marginRight: 5,
    // color: "#555",
  },
  actionText: {
    fontSize: 13,
    color: "#555",
  },
  timeText: {
    fontSize: 12,
    color: "#999",
  },

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

  modalButton: {
    padding: 10,
    width: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  modalText: {
    color: "white",
    fontWeight: "bold",
  },

  errorModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    marginTop: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
  },
  errorButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  errorButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
  },

  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },

  cancelText: {
    color: "#000",
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
});
