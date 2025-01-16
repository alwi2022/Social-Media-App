import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, StyleSheet, Text,  View } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
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
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
          {posts.tags?.map((tag, idx) => (
            <Text key={idx} style={{ fontSize: 14, marginRight: 6, color: 'gray' }}>
              #{tag}
            </Text>
          ))}
        </View>
        <View >
        <AntDesign name="like2" size={24} color="black" />
            <Text>{posts.likes?.length}</Text>
            <FontAwesome5 name="comment" size={24} color="black" />
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
