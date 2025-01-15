import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Bookcard({ book }) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate("Details", { name: book.title })}
      style={styles.card}
    >
      <Image
        source={{
          uri: `https://image.pollinations.ai/prompt/${encodeURIComponent(
            book.title
          )}?width=100&height=100&nologo=true`,
        }}
        style={{ width: 100, height: 100, borderRadius: 8 }}
      />
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{book.title}</Text>
        <Text style={{ fontSize: 14 }}>By: {book.author}</Text>
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
