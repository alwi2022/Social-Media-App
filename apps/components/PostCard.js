import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Postcard({ posts }) {
  const navigation = useNavigation();
  console.log(posts, "ini posts");

  return (
    <Pressable
  onPress={() =>
    navigation.navigate("Details", { id: posts._id, name: posts.content })
  }
  style={styles.card}
>

      <Image source={{ uri: posts.imgUrl }} style={{ width: 100, height: 100, borderRadius: 8 }} />
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{posts.content}</Text>
        <Text style={{ fontSize: 14 }}>By: {posts.authorDetail.username}</Text>
        <Text style={{ marginTop: 4 }}>✨✨✨✨✨</Text>
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
