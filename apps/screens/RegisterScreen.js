import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as SecureStore from "expo-secure-store";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

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
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://vos.line-scdn.net/strapi-cluster-instance-bucket-84/appicon_01_f9ed1cf01f.jpeg",
          }}
          style={styles.logo}
        />
      </View>

      {/* Header */}
      <Text style={styles.headerText}>Create Your LINE Account</Text>

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
  registerButton: {
    backgroundColor: "#00C300",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  registerButtonText: {
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
  loginText: {
    fontSize: 14,
    color: "#00C300",
    fontWeight: "bold",
    marginTop: 5,
  },
});