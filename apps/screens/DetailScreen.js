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
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
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
           <View >
        <AntDesign name="like2" size={24} color="black" />
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
