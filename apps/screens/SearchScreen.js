import {
  TextInput,
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import * as SecureStore from "expo-secure-store";
export default function SearchScreen() {
  const username = SecureStore.getItemAsync("username");
  const navigate = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.status}>Search friend below this</Text>
        </View>
        <Image
          source={{
            uri: `https://avatar.iran.liara.run/public/boy?username=${username}`,
          }}
          style={styles.storyImage}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search by username"
          value=""
          onPress={() => navigate.navigate("SearchDetail")}
        />
      </View>

      {/* Friend Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daftar Teman</Text>
        <TouchableOpacity
          style={styles.friendAction}
          onPress={() => navigate.navigate("SearchDetail")}
        >
          <Ionicons
            name="person-add"
            size={24}
            color="white"
            style={styles.friendIcon}
          />
          <Text style={styles.friendText}>Tambah Teman</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.friendAction}>
          <Ionicons
            name="people"
            size={24}
            color="white"
            style={styles.friendIcon}
          />
          <Text style={styles.friendText}>Buat Grup</Text>
        </TouchableOpacity>
      </View>

      {/* Sticker Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rekomendasi Stiker</Text>
        <FlatList
          horizontal
          data={["Mr.Wayne", "Si tengil ", "Luffy", "Mis lily"]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.stickerCard}>
              <Image
                source={{
                  uri: `https://image.pollinations.ai/prompt/${item}-sticker?model=flux-pro&width=800&height=800&nologo=true`,
                }}
                style={styles.stickerImage}
              />
              <Text style={styles.stickerText}>{item}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  status: {
    fontSize: 14,
    color: "#888",
  },
  storyImage: {
    width: 50,
    height: 50,
    marginRight: 2,
    borderRadius: 30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  friendAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00C300",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  friendIcon: {
    marginRight: 10,
  },
  friendText: {
    fontSize: 16,
    color: "#fff",
  },
  stickerCard: {
    alignItems: "center",
    marginRight: 15,
  },
  stickerImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  stickerText: {
    fontSize: 12,
    marginTop: 5,
  },
});
