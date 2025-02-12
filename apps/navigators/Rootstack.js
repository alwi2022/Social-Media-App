import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import DetailScreen from "../screens/DetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { Text, View } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SearchScreen from "../screens/SearchScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import WelcomeScreen from "../screens/GetStartedScreen";
import ChatScreen from "../screens/ChatScreen";
import ChatDetail from "../screens/ChatDetail";
import SearchScreenDetail from "../screens/SearchScreenDetail";

const stack = createNativeStackNavigator();

export default function RootStack() {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkLogin = async () => {
      const token = await SecureStore.getItemAsync("access_token");
      if (token) {
        setIsSignedIn(true);
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <>
    
      <stack.Navigator
        screenOptions={{
          // headerStyle: { backgroundColor: "#00C300" },
          // headerTintColor: "#fff",
          // headerTitleStyle: { fontWeight: "bold" },
          headerShown: true,
        }}
      >
        {isSignedIn ? (
          <>
            <stack.Screen
              name="Home"
              component={TabNavigator}
              options={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
                return { title: routeName };
              }}
            />

            <stack.Screen
              name="Details"
              component={DetailScreen}
              options={({ route }) => ({ title: "Post" })}
            />
            <stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: "Profile" }}
            />
            <stack.Screen
              name="Search"
              component={SearchScreen}
              options={{ title: "Search Users" }}
            />
            <stack.Screen
              name="SearchDetail"
              component={SearchScreenDetail}
              options={{ title: "Search Users" }}
            />
            <stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ title: "Chat Users" }}
            />
            <stack.Screen
              name="ChatDetail"
              component={ChatDetail}
              options={{ title: "Chat Detail" }}
            />
            <stack.Screen
              name="CreatePost"
              component={CreatePostScreen}
              options={{ title: "Create Post" }}
            />
          </>
        ) : (
          <>
          <stack.Screen name="Get-Started" component={WelcomeScreen} />
            <stack.Screen name="Login" component={LoginScreen} />
            <stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </stack.Navigator>
    </>
  );
}
