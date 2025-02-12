import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { formatDistanceToNow } from "date-fns";

export default function CommentCard({ comment }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const formatCommentTimestamp = (timestamp) => {
    if (!timestamp) {
      console.warn("Timestamp is missing, using default value.");
      return "Just now"; // Fallback jika timestamp tidak ada
    }

    let date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      console.warn("Invalid timestamp format:", timestamp);
      return "Unknown time"; // Fallback jika format salah
    }

    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <View style={styles.commentCard}>
      <Image
        source={{
          uri: `https://avatar.iran.liara.run/public/boy?username=${comment.username}`,
        }}
        style={styles.avatar}
      />

      <View style={styles.commentContent}>
        <View style={styles.header}>
          <Text style={styles.username}>{comment.username}</Text>
          <Text style={styles.timestamp}>
            {formatCommentTimestamp(comment.createdAt)}
          </Text>
        </View>

        <Text style={styles.content}>{comment.content}</Text>

        <View style={styles.actions}>
          <Pressable onPress={handleLike}>
            <Text
              style={[
                styles.actionText,
                { color: isLiked ? "#e74c3c" : "#3498db" },
              ]}
            >
              {isLiked ? "Unlike" : "Like"} ({likesCount})
            </Text>
          </Pressable>
          <Pressable>
            <Text style={styles.actionText}>Reply</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  commentContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    marginRight: 6,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  content: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 6,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionText: {
    fontSize: 13,
    marginRight: 15,
    fontWeight: "bold",
  },
});
