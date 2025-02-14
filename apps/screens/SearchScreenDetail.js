import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import Ionicons from "@expo/vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import loadingAnimation from "../assets/animations/AnimationAMongus.json";

const GET_USER_BY_USERNAME = gql`
  query GetUserByUserName($username: String) {
    getUserByUserName(username: $username) {
      _id
      name
      username
      email
      isFollowing
    }
  }
`;

const TOGGLE_FOLLOW = gql`
  mutation ToggleFollow($followingId: ID!) {
    toggleFollow(followingId: $followingId) {
      message
      isFollowing
    }
  }
`;

export default function SearchScreenDetail() {
  const [username, setUsername] = useState("");
  const userId = SecureStore.getItem("user_id");
  const [search, { loading, data, error,refetch }] = useLazyQuery(GET_USER_BY_USERNAME);
  const [toggleFollow] = useMutation(TOGGLE_FOLLOW);

  const handleSearch = async (text) => {
    setUsername(text);
    if (text.trim()) {
      await search({ variables: { username: text } });
    }
  };

  const handleToggleFollow = async (followingId) => {
    try {
      const { data } = await toggleFollow({
        variables: { followingId },
        update: (cache, { data: { toggleFollow } }) => {
          const existingData = cache.readQuery({
            query: GET_USER_BY_USERNAME,
            variables: { username },
          });

          const updatedUsers = existingData.getUserByUserName.map((user) => {
            if (user._id === followingId) {
              return { ...user, isFollowing: toggleFollow.isFollowing };
            }
            return user;
          });

          cache.writeQuery({
            query: GET_USER_BY_USERNAME,
            variables: { username },
            data: { getUserByUserName: updatedUsers },
          });
        },
      });
      refetch();
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
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
          value={username}
          onChangeText={handleSearch}
        />
      </View>

      {loading && (
        <View style={styles.center}>
          <LottieView
            source={loadingAnimation}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text>Loading...</Text>
        </View>
      )}
      {error && (
        <View style={styles.center}>
          <Text>{error.message}</Text>
        </View>
      )}

      {data?.getUserByUserName?.length === 0 && username.trim() !== "" && (
        <View style={styles.notFoundContainer}>
          <Ionicons name="person-remove" size={40} color="#888" />
          <Text style={styles.notFoundText}>Username not found</Text>
        </View>
      )}

      <FlatList
        data={data?.getUserByUserName?.filter((user) => user._id !== userId)}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Image
              source={{
                uri: `https://avatar.iran.liara.run/public/boy?username=${item.username}`,
              }}
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userDetails}>@{item.username}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.followButton,
                item.isFollowing ? styles.unfollowButton : styles.followButton,
              ]}
              onPress={() => handleToggleFollow(item._id)}
            >
              <Text style={styles.buttonText}>
                {item.isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
  },
  profileImage: {
    width: 55,
    height: 55,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userDetails: {
    fontSize: 14,
    color: "#555",
  },
  followButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#00C300",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  unfollowButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  notFoundContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  notFoundText: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
  lottie: {
    width: 150,
    height: 150,
  },
});
