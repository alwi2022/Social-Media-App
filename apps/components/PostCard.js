import { useNavigation } from "@react-navigation/native";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import { gql, useMutation } from "@apollo/client";

const ADD_LIKE = gql`
  mutation AddLike($postId: ID) {
    addLike(postId: $postId)
  }
`;

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
          style={{ width: 200, height: 200, borderRadius: 10 }}
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
          }}
        >
          <AntDesign
            name="like2"
            size={24}
            color={posts.likes?.length > 0 ? "blue" : "black"}
            onPress={() => handleLike(posts._id)}
          />
          <Text>{posts.likes?.length}</Text>
          <FontAwesome5
            name="comment"
            size={24}
            color={posts.comments?.length > 0 ? "blue" : "black"}
          />
          <Text>{posts.comments?.length}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    flexDirection: "row",
    gap: 8,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 2,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    padding: 10,
  },
});
