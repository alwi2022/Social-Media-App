import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AddComment from "../components/AddComment";
import CommentCard from "../components/CommentCard";

const GET_POST_ID = gql`
  query GetPostsById($id: ID) {
    getPostsById(_id: $id) {
      _id
      authorId
      content
      tags
      imgUrl
      createdAt
      updatedAt
      authorDetail {
        _id
        username
        email
        name
      }
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
    }
  }
`;

export default function DetailScreen({ route }) {
  const { _id } = route.params;

  const { data, refatch, loading } = useQuery(GET_POST_ID, {
    variables: { id: _id },
  });

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>loading......</Text>
      </View>
    );

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <ScrollView>
        <View style={{ padding: 8 }}>
          <Image
            source={{
              uri: `https://image.pollinations.ai/prompt/${data?.GetPostsById?.content}?width=100&height=100&nologo=true`,
            }}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
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
              {data?.GetPostsById?.content}
            </Text>

            {data?.GetPostsById?.authorDetail?.name}

            {data?.GetPostsById.comments?.map((comment, idx) => {
              return <CommentCard key={idx} comment={comment} />;
            })}
          </View>
        </View>
      </ScrollView>
      <AddComment postId={data?.GetPostsById?._id} refatch={refatch}/>
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
