import { useContext } from "react";
import { Button, Text, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store"
export default function ProfileScreen() {
  const { setIsSignedIn } = useContext(AuthContext);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile Screen</Text>
      <Button
        title="logout"
        onPress={async () => {
          setIsSignedIn(false);
          await SecureStore.deleteItemAsync("access_token")
        }}
      ></Button>
    </View>
  );
}
