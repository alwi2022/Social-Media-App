import { useNavigation } from "@react-navigation/native";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import { gql, useMutation } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";

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

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 8,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        backgroundColor: "#f0f0f0",
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Image
          source={{
            uri: `https://avatar.iran.liara.run/public/boy?username=${posts.authorDetail?.username}`,
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "lightgray",
          }}
        />
        <Text style={{ fontWeight: "bold", fontSize: 16, marginLeft: 8 }}>
          {posts.authorDetail?.username}
        </Text>
      </View>

      <Pressable
        onPress={() =>
          navigation.navigate("Details", { id: posts._id, name: posts.content })
        }
      >
        <Image
          source={{ uri: posts.imgUrl }}
          style={{
            width: "100%",
            height: 300,
            borderRadius: 10,
            marginTop: 10,
            objectFit: "cover",
          }}
        />
      </Pressable>

      <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "left",
          }}
        >
          {posts.content}
        </Text>

        <View
          style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}
        >
          {posts.tags?.map((tag, idx) => (
            <Text
              key={idx}
              style={{ fontSize: 14, marginHorizontal: 6, color: "gray" }}
            >
              #{tag}
            </Text>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Pressable
            onPress={() => handleLike(posts._id)}
            disabled={loading}
            style={{ flexDirection: "row" }}
          >
            <AntDesign
              name="like2"
              size={24}
              color={posts.likes?.length > 0 ? "blue" : "black"}
            />
            <Text style={{ marginLeft: 4, fontSize: 14 }}>
              {posts.likes?.length}
            </Text>
          </Pressable>

          <View style={{ alignItems: "center" }}>
            <FontAwesome5
              name="comment"
              size={24}
              color={posts.comments?.length > 0 ? "blue" : "black"}
            />
            <Text style={{ fontSize: 14, marginLeft: 4 }}>
              {posts.comments?.length}
            </Text>
          </View>
        </View>
      </View>

      <Text style={{fontSize: 12,
    color: "gray",
    marginTop: 10,
    textAlign: "right",}}>
        Posted: {formatRelativeDate(posts.createdAt)}
      </Text>
    </View>
  );
}
