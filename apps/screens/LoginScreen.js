import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";
const LOGIN = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      access_token
      user_id
    }
  }
`;

export default function LoginScreen() {
  const [username, setUsername] = useState("username2");
  const [password, setPassword] = useState("user2");
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
      await SecureStore.setItemAsync("username", username);

      setIsSignedIn(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message,
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 10,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Toast />
      <View style={styles.logo}>
        <Image source={require("../assets/line.png")} style={styles.logo} />
      </View>

      {/* Header */}
      <Text style={styles.title}>Login to LINE</Text>
      <Text style={styles.subtitle}>Please log in to continue</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          style={styles.input}
          secureTextEntry={true}
        />
      </View>

      {/* Login Button */}

      {loading ? (
        <ActivityIndicator size="large" color="#00C300" />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={submitLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      )}

      {/* Register Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Sign up here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#00C300",
  },
  subtitle: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FFF",
    marginBottom: 10,
    fontSize: 16,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#00C300",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },

  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  registerText: {
    fontSize: 14,
    color: "#00C300",
    fontWeight: "bold",
    marginTop: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 150,
    height: 150,
  },
});
