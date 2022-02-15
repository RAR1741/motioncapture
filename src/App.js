import * as React from 'react';
import { StyleSheet, Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


function HomeScreen({ navigation }) {
  return (
    <View style={styles.main}>
      <Text>Home Screen</Text>
      <Button
        style={styles.b}
        title="Pose 1"
        onPress={() => navigation.navigate('Camara')}
      />
      <Button
        title="Pose 1"
        onPress={() => navigation.navigate('Camara')}
      />
      <Button
        title="Pose 1"
        onPress={() => navigation.navigate('Camara')}
      />

    </View>
  );
}

function Camara({ navigation }) {
  return(
    //Classification Component
      <View>
        <Text>Camara will go here with the call of component</Text>
      </View>
  );
}


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camara" component={Camara} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  b:{
    padding: 10
  },
})
