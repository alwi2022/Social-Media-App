import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Alert, View } from "react-native";

const ADD_LIKE = gql`
  mutation AddLike($postId: ID) {
    addLike(postId: $postId)
  }
`;

export default function AddLike({ postId, refetch }) {
  const [like, setLike] = useState("");
  const [AddLike, { loading }] = useMutation(ADD_LIKE);

  const handleSubmit = async () => {
    try {
      await AddLike({
        variables: {
          postId: postId,
          like: like,
        },
      });
      await refetch();
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View>
        
    </View>
  )
}
