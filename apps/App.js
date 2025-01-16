import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./navigators/Rootstack";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apolo";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </ApolloProvider>
    </AuthProvider>
  );
}
