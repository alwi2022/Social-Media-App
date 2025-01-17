import React, { useState } from "react";
import {
  TextInput,
  Button,
  View,
  StyleSheet,
} from "react-native";
import { gql } from "@apollo/client";

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

export default function SearchScreen() {
  const [username, setUsername] = useState("");


  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        style={styles.input}
        placeholder="Search by username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Search"  color="#00C300"  />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
  }
});
