import { Image, Text, View } from "react-native";

export default function CommentCard({ comment }) {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Image
        source={{
          uri: `https://avatar.iran.liara.run/public/boy?username=${comment.username}`,
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "lightgray",
        }}
      />

      <View>
        <Text>
            {comment.username}
        </Text>

        <Text>
            {comment.content}
        </Text>
      </View>
    </View>
  );
}
