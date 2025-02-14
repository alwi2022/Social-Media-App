import { gql, useMutation } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const REGISTER = gql`
  mutation Mutation(
    $name: String
    $username: String
    $email: String
    $password: String
  ) {
    register(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      _id
      name
      username
      email
    }
  }
`;

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { loading }] = useMutation(REGISTER);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    if (!name || !username || !email || !password) {
      Toast.show({
        type: "error",
        text1: "Register Failed",
        text2: "All fields are required",
        visibilityTime: 3000,
        topOffset: 10,
      });
      return false;
    }
    return true;
  };

  const submitRegister = async () => {
    if (!validateForm()) return;
    if (!email.includes("@") || !email.includes(".")) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email",
        visibilityTime: 3000,
        topOffset: 10,
      });
      return;
    }
    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Weak Password",
        text2: "Password must be at least 6 characters",
        visibilityTime: 3000,
        topOffset: 10,
      });
      return;
    }

    try {
      const result = await register({
        variables: { name, username, email, password },
      });
      const access_token = result.data.register._id;
      await SecureStore.setItemAsync("access_token", access_token);

      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Account created successfully",
        visibilityTime: 3000,
        topOffset: 10,
      });

      navigation.navigate("Login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Register Failed",
        text2: error.message,
        visibilityTime: 3000,
        topOffset: 10,
      });
    }
  };

  return (
    <LinearGradient colors={["#ffffff", "#ffffff"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Toast />
            <Animated.View style={[styles.animatedView, { opacity: fadeAnim }]}>
              {/* Lottie Animation */}
              <LottieView
                source={require("../assets/animations/HumanWalkinWithDog.json")}
                autoPlay
                loop
                style={styles.lottie}
              />

              {/* Header */}
              <Text style={styles.title}>Create Your Account</Text>
              <Text style={styles.subtitle}>Sign up to get started!</Text>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <MaterialIcons
                    name="person"
                    size={24}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Name"
                    onChangeText={setName}
                    value={name}
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <MaterialIcons
                    name="badge"
                    size={24}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Username"
                    onChangeText={setUsername}
                    value={username}
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <MaterialIcons
                    name="email"
                    size={24}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Email"
                    onChangeText={setEmail}
                    value={email}
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed"
                    size={24}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Password"
                    onChangeText={setPassword}
                    value={password}
                    style={styles.input}
                    secureTextEntry
                  />
                </View>
              </View>

              {/* Register Button */}
              {loading ? (
                <ActivityIndicator size="large" color="#00C300" />
              ) : (
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={submitRegister}
                >
                  <Text style={styles.registerButtonText}>Sign Up</Text>
                </TouchableOpacity>
              )}

              {/* Login Link */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginText}>Login here</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  animatedView: {
    alignItems: "center",
    width: "100%",
  },
  lottie: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#00C300",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    height: 50,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  registerButton: {
    backgroundColor: "#00C300",
    paddingVertical: 15,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  registerButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#00C300",
    fontWeight: "bold",
  },
});
