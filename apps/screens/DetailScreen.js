import { gql, useMutation, useQuery } from "@apollo/client";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import AddComment from "../components/AddComment";
import CommentCard from "../components/CommentCard";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
const GET_POST_BY_ID = gql`
  query GetPostsById($id: ID) {
    getPostsById(_id: $id) {
      _id
      content
      imgUrl
      tags 
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

const ADD_LIKE = gql`
  mutation AddLike($postId: ID) {
    addLike(postId: $postId)
  }
`;

export default function DetailScreen({ route }) {
  const { id } = route.params;
  const { data, refetch, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { id },
  });

  const [like] = useMutation(ADD_LIKE, {
    refetchQueries: ["GetPosts"],
  });

  const handleLike = async (postId) => {
    try {
      const result = await like({
        variables: { postId },
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error.message}</Text>
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
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Text style={{ fontSize: 20 }}>{data.getPostsById.content}</Text>
            {data.getPostsById.tags?.map((tag, idx) => (
              <Text
                key={idx}
                style={{ fontSize: 14, marginRight: 6, color: "gray" }}
              >
                {tag}
              </Text>
            ))}
          </View>
          <View>
          <AntDesign name="like2" size={24} color="blue" onPress={() => handleLike(data.getPostsById._id)} />
          <Text>{data.getPostsById.likes?.length}</Text>
            <FontAwesome5 name="comment" size={24} color="black" />
            <Text>{data.getPostsById.comments?.length}</Text>
          </View>

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
