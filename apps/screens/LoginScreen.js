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
const LOGIN = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      access_token
    }
  }
`;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsSignedIn } = useContext(AuthContext);

  const [login, { loading }] = useMutation(LOGIN);
  const submitLogin = async () => {
    try {
      const result = await login({
        variables: {
          email: email,
          password: password,
        },
      });
      setIsSignedIn(true);
      console.log(result);

      const access_token = result.data.login.access_token;
      await SecureStore.setItemAsync("access_token", access_token);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={{ justifyContent: "center", flex: 1, padding: 10, gap: 8 }}>
      <View>
        <Text
          style={{
            color: "green",
            fontWeight: "900",
            fontSize: 24,
            textAlign: "center",
          }}
        ></Text>
        <FontAwesome5 name="line" size={24} color="black" /> BangLine
      </View>
      <View>
        <Text>Email</Text>
        <TextInput
          onChangeText={setEmail}
          value={email}
          style={styles.input}
          secureTextEntry={true}
        />
      </View>
      {loading ? (
        <ActivityIndicator size={"large"} color={"green"} />
      ) : (
        <Button title="Login" onPress={submitLogin} color={"#f4511e"} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    input:{
        height:40,
        borderWidth:1,
        padding:10,
        borderRadius:4
    }
})
