import { Image, View } from "react-native";

export default function CommentCard({ comment }) {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Image
        source={{
          uri: `https://avatar.iran.liara.run/public/boy?username=${comment.username}`,
        }}
        style={{
          backgroundColor: "white",
          paddingVertical: 4,
          paddingHorizontal: 8,
          minWidth: 100,
          borderTopLeftRadius: 0,
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
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
