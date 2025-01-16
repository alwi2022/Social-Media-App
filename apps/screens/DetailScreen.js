import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AddComment from "../components/AddComment";
import CommentCard from "../components/CommentCard";

const GET_POST_BY_ID = gql`
  query GetPostsById($id: ID) {
    getPostsById(_id: $id) {
      _id
      content
      imgUrl
      authorDetail {
        username
        name
      }
      comments {
        username
        content
      }
      likes {
        username
      }
    }
  }
`;


export default function DetailScreen({ route }) {
  const { id } = route.params;
  const {  data,refetch,loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { id },
  });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || !data?.getPostsById) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading data or data not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <ScrollView>
        <View style={{ padding: 8 }}>
          <Image
            source={{
              uri: `${data.getPostsById.imgUrl}?width=100&height=100&nologo=true`,
            }}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 8,
            }}
          />
          <View
            style={{
              gap: 8,
              marginTop: 8,
              borderTopColor: "lightgray",
              borderTopWidth: 1,
              paddingTop: 8,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {data.getPostsById.content}
            </Text>
            <Text>{data.getPostsById.authorDetail?.username}</Text>
            {data.getPostsById.comments?.map((comment, idx) => (
              <CommentCard key={comment._id || idx} comment={comment} />
            ))}
          </View>
        </View>
      </ScrollView>
      <AddComment postId={data.getPostsById._id} refetch={refetch} />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
