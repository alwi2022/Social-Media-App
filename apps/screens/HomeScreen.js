import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import Postcard from "../components/PostCard";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import errorAnimation from "../assets/animations/error.json"; //

const GET_POST = gql`
  query GetPosts {
    getPosts {
      _id
      authorId
      content
      tags
      imgUrl
      comments {
        username
        content
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      authorDetail {
        _id
        username
        email
        name
      }
    }
  }
`;

export default function HomeScreen() {
  const { loading, data, error, refetch } = useQuery(GET_POST, {
    fetchPolicy: "network-only",
  });

  const navigate = useNavigation();


  if (error) {
    return (
      <View style={styles.errorContainer}>
        <LottieView
          source={errorAnimation}
          autoPlay
          loop
          style={styles.errorLottie}
        />
        <Text style={styles.errorText}>Oops! Failed to load data.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Ambil daftar username unik dari `authorDetail`
  const uniqueUsernames = Array.from(
    new Set(data?.getPosts.map((post) => post.authorDetail.username))
  ).map((username) => {
    const user = data.getPosts.find(
      (post) => post.authorDetail.username === username
    );
    return {
      username: user.authorDetail.username,
      profilePicture: user.imgUrl || null, // Gunakan imgUrl dari post pertama
    };
  });

  // Gabungkan story dan postingan
  const postsWithStories = [
    { type: "story", users: uniqueUsernames }, // Data story
    ...(data?.getPosts || []),
  ];

  const renderItem = ({ item }) => {
    if (item.type === "story") {
      // Render story section
      return (
        <View style={styles.storySectionContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.storySection}
          >
            <Pressable
              style={styles.createStory}
              onPress={() => navigate.navigate("CreatePost")}
            >
              <View style={styles.createStoryContainer}>
                <Text style={styles.plusSign}>+</Text>
              </View>
              <Text style={styles.storyText}>Create Post</Text>
            </Pressable>

            {/* Render User Stories */}
            {item.users.map((user, index) => (
              <View key={index} style={styles.story}>
                <Image
                  source={{
                    uri:
                      user.profilePicture || `https://via.placeholder.com/50`,
                  }}
                  style={styles.storyImage}
                />
                <Text style={styles.storyText}>{user.username}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }

    // Render post
    return <Postcard posts={item} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={postsWithStories}
        renderItem={renderItem}
        keyExtractor={
          (item, index) => item._id || `story-${index}` // Key fallback untuk story
        }
        refreshing={loading}
        onRefresh={() => refetch()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  storySectionContainer: {
    marginBottom: 10,
  },
  storySection: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  story: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  storyImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "green",
  },
  storyText: {
    fontSize: 12,
    marginTop: 5,
  },
  createStory: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  createStoryContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#d4d4d4",
    justifyContent: "center",
    alignItems: "center",
  },
  plusSign: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  lottie: {
    width: 150,
    height: 150,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorLottie: {
    width: 200,
    height: 200,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff5555",
    marginTop: 10,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#ff5555",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
