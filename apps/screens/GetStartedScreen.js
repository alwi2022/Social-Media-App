import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const WelcomeScreen = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/LINE_logo.svg/480px-LINE_logo.svg.png?20220419085336",
        }} // Replace with your logo URL
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to LINE</Text>
      <Text style={styles.subtitle}>
        Free messaging, voice and video calls, and more!
      </Text>
      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonTextLogin}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonTextSignUp}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  },
  subtitle: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 150,
    textAlign: "center",
  },
  buttonPrimary: {
    backgroundColor: "#00c300",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#00c300",
    width: "80%",
    alignItems: "center",
  },
  buttonTextLogin: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  buttonTextSignUp: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
