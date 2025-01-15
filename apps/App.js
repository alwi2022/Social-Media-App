import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title} >Wassup</Text>
      <StatusBar style="auto" />
    </View>
      // <NavigationContainer>{/* Rest of your app code */}</NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
   
  },

  title:{
     fontWeight:'50',
     color:'blue'
  }
});
