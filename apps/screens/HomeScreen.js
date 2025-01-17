import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import Postcard from "../components/PostCard";
const GET_POST = gql`
  query GetPosts {
    getPosts {
      _id
      authorId
      content
      tags
      imgUrl
      comments {
        username
        content
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      authorDetail {
        _id
        username
        email
        name
      }
    }
  }
`;

export default function HomeScreen() {
  const { loading, data, error } = useQuery(GET_POST, {
    fetchPolicy: "network-only",
  });

  if (loading)
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <ActivityIndicator size={"large"} color={"tomato"} />
        <Text>Loading...</Text>
      </View>
    );

  if (error)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error.message}</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data?.getPosts}
        renderItem={({ item }) => <Postcard posts={item} />}
        keyExtractor={(item) => item._id}
        onRefresh={async () => {
          // console.log("ini di homescreen masuk");
          await refetch();
        }}
        refreshing={loading}
      />
    </View>
  );
}
{
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
});
