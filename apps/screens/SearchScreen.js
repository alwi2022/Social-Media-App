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
} from "react-native";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

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

const FOLLOW_USER = gql`
 mutation Follow($followingId: ID) {
  follow(followingId: $followingId)
}
`;



export default function SearchScreen() {
  const [username, setUsername] = useState("");

  const [getUserByUserName, { loading, data, error }] =
    useLazyQuery(GET_USER_BY_USERNAME);

  const handleSearch = () => {
    if (username.trim() === "") return;
    getUserByUserName({ variables: { username } });
  };
  

  const [followUser] = useMutation(FOLLOW_USER);

  const handleFollow = async (followingId) => {
    try {
      const response = await followUser({ variables: { followingId } });
      Alert.alert("Follow successful:", response.data.follow)
    } catch (error) {
      console.log(error);
      
    }
  };
  

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        style={styles.input}
        placeholder="Search by username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Search" color="#00C300" onPress={handleSearch} />
      {data && data.getUserByUserName && (
        <FlatList
          data={data.getUserByUserName}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Image
                source={{
                  uri: `https://avatar.iran.liara.run/public/boy?username=${item.username}`,
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "lightgray",
                }}
              />
              <Text style={styles.userName}>{item.name}</Text>
              <Text>Username: {item.username}</Text>
              <Text>Email: {item.email}</Text>

              <View style={{ width: 100, marginTop: 10 }}>
                <Button
                  title="follow"
                  onPress={() => handleFollow(item._id)}
                  color="#00C300"
                />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
