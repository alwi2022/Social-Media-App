import { useNavigation } from "@react-navigation/native";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { gql, useMutation } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign'
const ADD_LIKE = gql`
  mutation AddLike($postId: ID) {
    addLike(postId: $postId)
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

  const [like, { loading, data }] = useMutation(ADD_LIKE, {
    refetchQueries: ["GetPosts"],
  });

  const handleLike = async (postId) => {
    try {
      const result = await like({
        variables: { postId },
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };
 const isLiked = posts.likes?.some(like => like.username === posts.authorDetail?.username);
 console.log(isLiked,'ini liked');
 
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{
            uri: `https://avatar.iran.liara.run/public/boy?username=${posts.authorDetail?.username}`,
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{posts.authorDetail?.username}</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.postContent}>{posts.content}</Text>

        <View style={styles.tagsContainer}>
          {posts.tags?.map((tag, idx) => (
            <Text key={idx} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
      </View>

      <Pressable
  onPress={() =>
    navigation.navigate("Details", { id: posts._id, name: posts.content })
  }
>
  {posts.imgUrl ? (
    <Image source={{ uri: posts.imgUrl }} style={styles.postImage} />
  ) : (
    <Text style={styles.noImageText}>No image available</Text>   )}
</Pressable>


      <View style={styles.actionsContainer}>
        <Pressable
          onPress={() => handleLike(posts._id)}
          disabled={loading}
          style={styles.likeButton}
        >
          <AntDesign name="heart" size={24} color={isLiked? 'red': 'gray'}  />
          <Text style={styles.likeCount}>{posts.likes?.length}</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.navigate("Details", { id: posts._id, name: posts.content })
          }
          style={styles.commentButton}
        >
          <FontAwesome
            name="comment-o"
            size={24}
            color={"black"}
          />
          <Text style={styles.commentCount}>{posts.comments?.length}</Text>
        </Pressable>

<Pressable    style={styles.commentButton}>
  
      <SimpleLineIcons name="paper-plane" size={24} color="black" />
</Pressable>

      </View>
      <Text style={styles.timeText}>Posted: {formatRelativeDate(posts.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "lightgray",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
  contentContainer: {
    paddingTop: 12,
  },
  postContent: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
    textAlign: "left",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    fontSize: 14,
    marginHorizontal: 8,
    color: "#555",
  },
  actionsContainer: {
    flexDirection: "row",
    marginTop: 52,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
  },
  commentButton: {
    flexDirection: "row",
    marginLeft:20,
    alignItems: "center",
  },
  commentCount: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
  },
  
    postImage: {
      width: "100%",
      height: 250,
      borderRadius: 12,
      marginTop: 12,
      objectFit: "cover",
    },
    noImageText: {
      fontSize: 16,
      color: "gray",
      textAlign: "center",
      marginTop: 12,
    },
  
  timeText: {
    fontSize: 12,
    color: "#888",
    marginTop: 10,
    textAlign: "right",
  },
});
