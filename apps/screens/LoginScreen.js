import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [username, setUsername] = useState("");
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
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg",
          }}
          style={styles.logo}
        />
      </View>

      {/* Header */}
      <Text style={styles.headerText}>Welcome to LINE</Text>

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
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00C300",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
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
  },
  loginButton: {
    backgroundColor: "#00C300",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
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
});
