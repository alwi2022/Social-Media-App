import { FlatList, StyleSheet, View } from "react-native";
import Bookcard from "../components/Bookcard";

export default function HomeScreen() {
  const books = [
    { title: "LINE Chat 101", author: "J.D. Salinger", price: 120000 },
    { title: "Chatbot for Fun", author: "Mustofa", price: 90000 },
    { title: "LINE Story Tips", author: "Oda Nobunaga", price: 20000 },
    { title: "LINE Stiker", author: "Sule", price: 1000 },
    { title: "Emoticon Line", author: "Magnus Chase", price: 57000 },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={({ item }) => <Bookcard book={item} />}
        keyExtractor={(item, idx) => `${item.title}-${idx}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
});
