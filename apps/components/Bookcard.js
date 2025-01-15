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
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>By: {book.author}</Text>
        <Text style={styles.rating}>✨✨✨✨✨</Text>
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
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
  },
  image: { width: 100, height: 100, borderRadius: 8 },
  details: { flex: 1, marginLeft: 8 },
  title: { fontSize: 16, fontWeight: "bold" },
  author: { fontSize: 14, color: "#555" },
  rating: { marginTop: 4, color: "#f4c542" },
});
