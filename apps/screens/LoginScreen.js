import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
const LOGIN = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      access_token
      user_id 
    }
  }
`;

export default function LoginScreen() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsSignedIn } = useContext(AuthContext);
  const navigation = useNavigation();

  const [login, { loading }] = useMutation(LOGIN);
  const submitLogin = async () => {
    try {
      const result = await login({
        variables: {
          username: username,
          password: password,
        },
      });
      const { access_token, user_id } = result.data.login;

    await SecureStore.setItemAsync("access_token", access_token);
    await SecureStore.setItemAsync("user_id", user_id);
      setIsSignedIn(true);
      console.log(result);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text
          style={{
            color: "green",
            fontWeight: "900",
            fontSize: 24,
          }}
        >
          Login
          <FontAwesome5 name="line" size={24} color="green" />
        </Text>
      </View>
      <View>
        <Text>username</Text>
        <TextInput
          onChangeText={setusername}
          value={username}
          style={styles.input}
        />
      </View>
      <View>
        <Text>Password</Text>
        <TextInput
          onChangeText={setPassword}
          value={password}
          style={styles.input}
          secureTextEntry={true}
        />
      </View>
      {loading ? (
        <ActivityIndicator size={"large"} color={"green"} />
      ) : (
        <Button title="Login" onPress={submitLogin} color={"#00C300"} />
      )}

      <View style={styles.footer}>
        <Text>Dont have an account?</Text>
        <Button
          title="Register"
          onPress={() => navigation.navigate("Register")}
          color="#00C300"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
});
