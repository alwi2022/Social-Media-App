import { gql, useMutation } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
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
  const [errorMessage, setErrorMessage] = useState("");
  const [register, { loading }] = useMutation(REGISTER);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    if (!name || !username || !email || !password) {
      setErrorMessage("All fields are required");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setErrorMessage("Please enter a valid email");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const submitRegister = async () => {
    if (!validateForm()) return;
    try {
      const result = await register({
        variables: { name, username, email, password },
      });
      const access_token = result.data.register._id;
      await SecureStore.setItemAsync("access_token", access_token);
      navigation.navigate("Login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Register Failed",
        text2: error.message,
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 10,
      });
    }
  };

  return (
    <LinearGradient colors={["#00c300", "#008000"]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.innerContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Toast />
            <Animated.View style={[styles.animatedView, { opacity: fadeAnim }]}>
              {/* Lottie Animation */}
              <LottieView source={require("../assets/animations/HumanWalkinWithDog.json")} autoPlay loop style={styles.lottie} />
              
              {/* Header */}
              <Text style={styles.title}>Create Your Account</Text>
              <Text style={styles.subtitle}>Sign up to get started!</Text>

              {/* Error Message */}
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="person" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput placeholder="Name" onChangeText={setName} value={name} style={styles.input} />
                </View>

                <View style={styles.inputWrapper}>
                  <MaterialIcons name="alternate-email" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput placeholder="Username" onChangeText={setUsername} value={username} style={styles.input} />
                </View>

                <View style={styles.inputWrapper}>
                  <MaterialIcons name="email" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput placeholder="Email" onChangeText={setEmail} value={email} style={styles.input} />
                </View>

                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput placeholder="Password" onChangeText={setPassword} value={password} style={styles.input} secureTextEntry />
                </View>
              </View>

              {/* Register Button */}
              {loading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <TouchableOpacity style={styles.registerButton} onPress={submitRegister}>
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
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
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
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#f0f0f0",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
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
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    height: 50,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
  },
  registerButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  registerButtonText: {
    fontSize: 16,
    color: "#00c300",
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
});
