import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./navigators/Rootstack";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apolo";
import { AuthProvider } from "./context/AuthContext";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ApolloProvider client={client}>
          <NavigationContainer>
            <Toast />
            <RootStack />
          </NavigationContainer>
        </ApolloProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
