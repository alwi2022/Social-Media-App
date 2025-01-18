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
  const date = new Date(dateString);
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
        backgroundColor: "white",
        borderRadius: 10,
        marginVertical: 8,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      }}
    >
      <Pressable
        onPress={() =>
          navigation.navigate("Details", { id: posts._id, name: posts.content })
        }
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Image
          source={{ uri: posts.imgUrl }}
          style={{ width: 200, height: 200, borderRadius: 10 ,marginTop:20 }}
        />
      </Pressable>

      <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          {posts.content}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 10,
          }}
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
            justifyContent: "space-around",
            alignItems: "center",
            marginTop:20
          }}
        >
          <Pressable
            onPress={() => handleLike(posts._id)}
            disabled={loading}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <AntDesign
              name="like2"
              size={24}
              color={posts.likes?.length > 0 ? "blue" : "black"}
            />
            <Text style={{ fontSize: 14, marginLeft: 4 }}>
              {posts.likes?.length}
            </Text>
          </Pressable>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome5
              name="comment"
              size={24}
              color={posts.comments?.length > 0 ? "blue" : "black"}
            />
            <Text style={{ marginLeft: 4, fontSize: 14 }}>
              {posts.comments?.length}
            </Text>
          </View>
        </View>
      </View>
      <Text
          style={{
            fontSize: 13,
            color: "black",
            position: "absolute", 
            right: 10, 
          }}>
          Posted: {formatRelativeDate(posts.createdAt)}
        </Text>
    </View>
  );
}

