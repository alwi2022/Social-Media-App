import { gql, useMutation, useQuery } from "@apollo/client";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import AddComment from "../components/AddComment";
import CommentCard from "../components/CommentCard";

const GET_POST_BY_ID = gql`
  query GetPostsById($id: ID) {
    getPostsById(_id: $id) {
      _id
      content
      imgUrl
      tags
      authorDetail {
        username
        name
      }
      comments {
        username
        content
      }
      likes {
        username
      }
    }
  }
`;

const ADD_LIKE = gql`
  mutation AddLike($postId: ID) {
    addLike(postId: $postId)
  }
`;

export default function DetailScreen({ route }) {
  const { id } = route.params;
  const { data, refetch, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { id },
  });

  const [like] = useMutation(ADD_LIKE, {
    refetchQueries: ["GetPosts"],
  });

  const handleLike = async (postId) => {
    try {
      await like({
        variables: { postId },
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: `https://avatar.iran.liara.run/public/boy?username=${data.getPostsById?.authorDetail.username}`,
          }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.username}>{data.getPostsById?.authorDetail.username}</Text>
          <Text style={styles.subText}>@{data.getPostsById?.authorDetail.name}</Text>
        </View>
        <AntDesign name="ellipsis1" size={22} color="#777" />
      </View>

      <ScrollView>
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.contentText}>{data.getPostsById.content}</Text>

          {/* Image */}
          {data.getPostsById.imgUrl && (
            <Image
              source={{ uri: `${data.getPostsById.imgUrl}` }}
              style={styles.contentImage}
            />
          )}

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {data.getPostsById.tags?.map((tag, idx) => (
              <Text key={idx} style={styles.tag}>#{tag}</Text>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <Pressable style={styles.actionButton} onPress={() => handleLike(data.getPostsById._id)}>
              <AntDesign name="like1" size={22} color={data.getPostsById.likes?.length > 0 ? "#007AFF" : "#888"} />
              <Text style={styles.actionText}>{data.getPostsById.likes?.length}</Text>
            </Pressable>

            <Pressable style={styles.actionButton}>
              <FontAwesome5 name="comment" size={20} color={data.getPostsById.comments?.length > 0 ? "#007AFF" : "#888"} />
              <Text style={styles.actionText}>{data.getPostsById.comments?.length}</Text>
            </Pressable>
          </View>

          {/* Comments */}
          <View style={styles.commentsContainer}>
            {data.getPostsById.comments?.map((comment, idx) => (
              <View key={idx} style={styles.commentCard}>
                <CommentCard key={idx} comment={comment} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add Comment */}
      <View style={styles.addCommentContainer}>
        <AddComment postId={data.getPostsById._id} refetch={refetch} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  subText: {
    fontSize: 12,
    color: "#666",
  },
  content: {
    padding: 15,
  },
  contentText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  contentImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    fontSize: 14,
    color: "#007AFF",
    marginRight: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#555",
  },
  commentsContainer: {
    marginTop: 10,
  },
  commentCard: {
    marginBottom: 10,
  },
  addCommentContainer: {
    padding: 10,
    backgroundColor: "#fff",
  },
});
