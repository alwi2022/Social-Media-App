import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import DetailScreen from "../screens/DetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "green" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <stack.Screen
          name="Home"
          component={TabNavigator}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "Books";
            return { title: routeName };
          }}
        />

        <stack.Screen
          name="Details"
          component={DetailScreen}
          options={({ route }) => ({ title: route.params.name })}
        />
        <stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profile" }}
        />
      </stack.Navigator>
    </>
  );
}
