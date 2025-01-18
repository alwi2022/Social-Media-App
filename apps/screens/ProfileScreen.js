import { useContext, useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { gql, useQuery } from "@apollo/client";

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID) {
    getUserById(_id: $id) {
      _id
      name
      username
      email
      followers {
        username
        email
      }
      following {
        username
        email
      }
    }
  }
`;

export default function ProfileScreen() {
  const { setIsSignedIn } = useContext(AuthContext);

  const userId = SecureStore.getItem("user_id");
  console.log(userId, "ini usaer id");

  const { data, loading, error,refetch  } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
     fetchPolicy: "network-only"
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
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
    <View style={{ flex: 1, padding: 16 }}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri:
              `https://avatar.iran.liara.run/public/boy?username=${data?.getUserById?.username}` ||
              "https://via.placeholder.com/150",
          }}
          style={{ width: 80,
            height: 80,
            borderRadius: 40,
            marginBottom: 10,
            backgroundColor: "lightgray",}}
        />
        <Text style={styles.header}>{data?.getUserById?.name}</Text>
        <Text style={styles.info}>{data?.getUserById?.username}</Text>
        <Text style={styles.info}>{data?.getUserById?.email}</Text>
      </View>

      <Text style={styles.subHeader}>Followers:</Text>

      <FlatList
        data={data?.getUserById?.followers}
        keyExtractor={(item) => item.username }
        onRefresh={async () => {
          await refetch();
        }}
        refreshing={loading}
        renderItem={({ item }) => (
          <View style={styles.card}>
                <Image
              source={{
                uri:
                  `https://avatar.iran.liara.run/public/boy?username=${item?.username}` ||
                  "https://via.placeholder.com/150",
              }}
              style={styles.avatar}
            />
            <Text style={styles.cardText}>Username: {item.username}</Text>
            <Text style={styles.cardText}>Email: {item.email}</Text>
          </View>
        )}
      />

      <Text style={styles.subHeader}>Following:</Text>
      <FlatList
        data={data?.getUserById?.following}
        keyExtractor={(item) => item.username }
        onRefresh={async () => {
          await refetch();
        }}
        refreshing={loading}
        renderItem={({ item }) => (
          <View style={styles.card}>
                <Image
              source={{
                uri:
                  `https://avatar.iran.liara.run/public/boy?username=${item?.username}` ||
                  "https://via.placeholder.com/150",
              }}
              style={styles.avatar}
            />
            <Text style={styles.cardText}>Username: {item.username}</Text>
            <Text style={styles.cardText}>Email: {item.email}</Text>
          </View>
        )}
      />

      <Button
        title="Logout"
        onPress={async () => {
          setIsSignedIn(false);
          await SecureStore.deleteItemAsync("access_token");
             await SecureStore.deleteItemAsync("user_id");
        }}
        color="red"
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
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: "lightgray",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
  },
});
