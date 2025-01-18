import { gql, useMutation, useQuery } from "@apollo/client";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
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
        <ActivityIndicator size="large" color="green" />
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
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Image
          source={{
            uri: `https://avatar.iran.liara.run/public/boy?username=${data.getPostsById?.authorDetail.username}`,
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "lightgray",
          }}
        />
        <Text style={{ fontWeight: "bold", fontSize: 16, marginLeft: 8 }}>
          {data.getPostsById?.authorDetail.username}
        </Text>
      </View>

      <ScrollView>
        <View style={{ padding: 8 }}>
          <View
            style={{ alignItems: "center", paddingTop: 5, borderRadius: 20 }}
          >
            <Image
              source={{
                uri: `${data.getPostsById.imgUrl}`,
              }}
              style={{
                width: 300,
                height: 300,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 16,
              }}
            />
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {data.getPostsById.content}
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              {data.getPostsById.tags?.map((tag, idx) => (
                <Text
                  key={idx}
                  style={{ fontSize: 14, marginRight: 6, color: "gray" }}
                >
                  #{tag}
                </Text>
              ))}
            </View>
            <Text style={{ fontSize: 16, color: "gray", marginVertical: 8 }}>
              Posted by: {data.getPostsById.authorDetail.name}
            </Text>
            <Text>Username: {data.getPostsById.authorDetail.username}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
              marginTop: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AntDesign
                name="like2"
                size={24}
                color={data.getPostsById.likes?.length > 0 ? "blue" : "black"}
                onPress={() => handleLike(data.getPostsById._id)}
              />
              <Text style={{ marginLeft: 6 }}>
                {data.getPostsById.likes?.length}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5
                name="comment"
                size={24}
                color={
                  data.getPostsById.comments?.length > 0 ? "blue" : "black"
                }
              />
              <Text style={{ marginLeft: 6 }}>
                {data.getPostsById.comments?.length}
              </Text>
            </View>
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
            {data.getPostsById.comments?.map((comment, idx) => (
              <CommentCard key={idx} comment={comment} />
            ))}
          </View>
        </View>
      </ScrollView>
      <AddComment postId={data.getPostsById._id} refetch={refetch} />
    </View>
  );
}

