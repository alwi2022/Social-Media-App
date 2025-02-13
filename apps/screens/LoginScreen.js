import { gql, useMutation } from "@apollo/client";
import { useContext, useState, useRef, useEffect } from "react";
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
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

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
  const [showPassword, setShowPassword] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [login, { loading }] = useMutation(LOGIN);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    if (!username || !password) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Username and password are required!",
        visibilityTime: 3000,
        topOffset: 10,
      });
      return false;
    }
    return true;
  };

  const submitLogin = async () => {
    if (!validateForm()) return;

    try {
      const result = await login({
        variables: { username, password },
      });

      const { access_token, user_id } = result.data.login;

      await SecureStore.setItemAsync("access_token", access_token);
      await SecureStore.setItemAsync("user_id", user_id);
      await SecureStore.setItemAsync("username", username);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
        visibilityTime: 3000,
        topOffset: 10,
      });

      setIsSignedIn(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message,
        visibilityTime: 3000,
        topOffset: 10,
      });
    }
  };

  return (
    <LinearGradient colors={["#ffffff", "#ffffff"]} style={styles.container}>
      <Toast />
      <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
        {/* Logo */}
        <Image source={require("../assets/line.png")} style={styles.logo} />

        {/* Header */}
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Log in to continue</Text>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Username"
            onChangeText={setUsername}
            value={username}
            style={styles.input}
          />
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              style={styles.input}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>
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
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#00C300",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
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
    fontSize: 16,
    width: "100%",
    marginBottom: 10,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
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
});
