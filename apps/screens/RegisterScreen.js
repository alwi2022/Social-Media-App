import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

import Toast from "react-native-toast-message";

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

  const submitRegister = async () => {
    try {
      const result = await register({
        variables: {
          name: name,
          username: username,
          email: email,
          password: password,
        },
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Toast />
          {/* Lottie Animation */}
          <LottieView
            source={require("../assets/animations/HumanWalkinWithDog.json")}
            autoPlay
            loop
            style={styles.logo}
          />

          {/* Header */}
          <Text style={styles.title}>Create Your LINE Account</Text>
          <Text style={styles.subtitle}>Sign up to get started!</Text>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Name"
              onChangeText={setName}
              value={name}
              style={styles.input}
            />
            <TextInput
              placeholder="Username"
              onChangeText={setUsername}
              value={username}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: -10,
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
  registerButton: {
    backgroundColor: "#00C300",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  registerButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  loginText: {
    fontSize: 14,
    color: "#00C300",
    fontWeight: "bold",
    marginTop: 5,
  },
});
