import React, { useState } from "react";
import {
  TextInput,
  Button,
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
const GET_USER_BY_USERNAME = gql`
  query GetUserByUserName($username: String) {
    getUserByUserName(username: $username) {
      _id
      name
      username
      email
    }
  }
`;

const UNFOLLOW_USER = gql`
  mutation Unfollow($followingId: ID) {
    unfollow(followingId: $followingId)
  }
`;

const FOLLOW_USER = gql`
  mutation Follow($followingId: ID) {
    follow(followingId: $followingId)
  }
`;

export default function SearchScreen() {
  const [username, setUsername] = useState("");
const userId = SecureStore.getItem("user_id");
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [search, { loading, data, error, refetch }] =
    useLazyQuery(GET_USER_BY_USERNAME);

  const handleSearch = async () => {
    if (!username.trim()) {
      Alert.alert("Username is required");
      return;
    }
    await search({ variables: { username } });
  };

  const handleUnFollow = async (followingId) => {
    try {
      const response = await unfollowUser({
        variables: { followingId },
      });

      if (response.data.unfollow === "unfollow") {
        Alert.alert("unfollow successful:", response.data.unfollow);
      } else if (response.data.unfollow === "You already unfollow this user") {
        Alert.alert(response.data.unfollow);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleFollow = async (followingId) => {
    try {
      const response = await followUser({ variables: { followingId } });
      if (response.data.follow === "follow") {
        Alert.alert("Follow successful:", response.data.follow);
      } else if (response.data.follow === "You already follow this user") {
        Alert.alert(response.data.follow);
      }
      await refetch();
    } catch (error) {
      console.log(error, "ini erro follow");

      Alert.alert(error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        style={styles.input}
        placeholder="Search by username"
        value={username}
        onChangeText={setUsername}
      />
      <View>
        {loading ? (
          <ActivityIndicator size={"large"} color={"green"} />
        ) : (
          <Button title="Search" color="#00C300" onPress={handleSearch} />
        )}
      </View>

      <FlatList
        data={data?.getUserByUserName?.filter((user) => user._id !== userId)}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{
                  uri: `https://avatar.iran.liara.run/public/boy?username=${item.username}`,
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "lightgray",
                  marginRight: 10,
                }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 14, color: "gray" }}>
                  Username: {item.username}
                </Text>
                <Text style={styles.userDetails}>Email: {item.email}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
  <View style={{ flex: 1, marginRight: 5 }}>
    <Button
      title="Follow"
      onPress={() => handleFollow(item._id)}
      color="#00C300"
    />
  </View>
  <View style={{ flex: 1, marginLeft: 5 }}>
    <Button
      title="Unfollow"
      onPress={() => handleUnFollow(item._id)}
      color="red"
    />
  </View>
</View>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
    borderColor: "gray",
  },
  userCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
});
