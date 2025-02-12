import { useCallback, useContext } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { gql, useQuery } from "@apollo/client";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useFocusEffect } from "@react-navigation/native";

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID) {
    getUserById(_id: $id) {
      _id
      name
      username
      followers {
        username
      }
      following {
        username
      }
    }
  }
`;

export default function ProfileScreen() {
  const { setIsSignedIn } = useContext(AuthContext);
  const userId = SecureStore.getItem("user_id");

  const { data, loading, error, refetch  } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    fetchPolicy: "network-only",
  });


  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );
  if (loading) {
    return (
      <View style={styles.center}>
        <LottieView
          source={require("../assets/animations/AnimationAMongus.json")}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Avatar & User Info */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: `https://avatar.iran.liara.run/public/boy?username=${data?.getUserById?.username}`,
          }}
          style={styles.profileAvatar}
        />
        <Text style={styles.username}>{data?.getUserById?.username}</Text>
        <Text style={styles.name}>{data?.getUserById?.name}</Text>
      </View>

      {/* Followers & Following */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {data?.getUserById?.followers.length}
          </Text>
          <Text style={styles.statText}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {data?.getUserById?.following.length}
          </Text>
          <Text style={styles.statText}>Following</Text>
        </View>
      </View>

      {/* Logout Button */}
      <Pressable
        style={styles.logoutButton}
        onPress={async () => {
          setIsSignedIn(false);
          await SecureStore.deleteItemAsync("access_token");
          await SecureStore.deleteItemAsync("user_id");
        }}
      >
        <AntDesign name="logout" size={18} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#00C300",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  name: {
    fontSize: 14,
    color: "#555",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00C300",
  },
  statText: {
    fontSize: 12,
    color: "#777",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    width: "50%",
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginLeft: 6,
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
  },
});
