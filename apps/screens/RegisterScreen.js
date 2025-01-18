import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
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
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ color: "green", fontWeight: "900", fontSize: 24 }}>
          Register
        <FontAwesome5 name="line" size={24} color="green" />
        </Text>
      </View>

      <View>
        <Text>Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />
      </View>
      <View>
        <Text>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      </View>

      <View>
        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} />
      </View>

      <View>
        <Text>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
      </View>

      {loading ? (
        <ActivityIndicator size={"large"} color={"green"} />
      ) : (
        <Button title="Register" onPress={submitRegister} color="#00C300" />
      )}

      <View style={styles.footer}>
        <Text>Already have an account?</Text>
        <Button
          title="Login"
          onPress={() => navigation.navigate("Login")}
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
