import { useNavigation } from "@react-navigation/native";
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient colors={["#ffffff", "#ffffff"]} style={styles.container}>
      <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
        {/* Logo */}
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/LINE_logo.svg/480px-LINE_logo.svg.png?20220419085336",
          }}
          style={styles.logo}
        />

        {/* Header */}
        <Text style={styles.title}>Welcome to LINE</Text>
        <Text style={styles.subtitle}>
          Stay connected with friends & family
        </Text>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate("Login")}
        >
          <Ionicons
            name="log-in"
            size={20}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate("Register")}
        >
          <Ionicons
            name="person-add"
            size={20}
            color="#1E3C72"
            style={styles.buttonIconSignUp}
          />
          <Text style={styles.buttonTextSecondary}>Sign up</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

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
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00C300",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  buttonPrimary: {
    flexDirection: "row",
    backgroundColor: "#00C300",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonSecondary: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#00C300",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonIconSignUp: {
    marginRight: 10,
    color: "#00C300",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  buttonTextSecondary: {
    fontSize: 16,
    color: "#00C300",
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
