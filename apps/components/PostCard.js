import { useNavigation } from "@react-navigation/native";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import { gql, useMutation } from "@apollo/client";

const ADD_LIKE = gql`
mutation AddLike($postId: ID) {
  addLike(postId: $postId)
}
`

export default function Postcard({ posts }) {
  const navigation = useNavigation();

const [like,{loading,data}] = useMutation(ADD_LIKE,{
  refetchQueries:["GetPosts"]
})

const handleLike = async (postId) =>{
  try {
    const result =await like({
      variables:{postId}
    })
  } catch (error) {
    Alert.alert(error.message)
  }
}

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Details", { id: posts._id, name: posts.content })
      }
      style={styles.card}
    >
      <Image
        source={{ uri: posts.imgUrl }}
        style={{ width: 100, height: 100, borderRadius: 8 }}
      />
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {posts.content}
        </Text>
        <Text style={{ fontSize: 14 }}>By: {posts.authorDetail.username}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
          {posts.tags?.map((tag, idx) => (
            <Text
              key={idx}
              style={{ fontSize: 14, marginRight: 6, color: "gray" }}
            >
              #{tag}
            </Text>
          ))}
        </View>
        <View>
          <AntDesign name="like2" size={24} color={posts.likes?.length > 0 ? "blue" : 'black'} onPress={() => handleLike(posts._id)} />
          <Text>{posts.likes?.length}</Text>
          <FontAwesome5 name="comment" size={24} color={posts.comments?.length > 0? "blue" : "black"} />
          <Text>{posts.comments?.length}</Text>
        </View>
      </View>
    </Pressable>
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
