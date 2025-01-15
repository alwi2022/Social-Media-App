import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./navigators/Rootstack";

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
