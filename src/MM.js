import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import { registerRootComponent } from 'expo';
import { inlineStyles } from 'react-native-svg';
import { FlipLeftRight } from '@tensorflow/tfjs';

const App = () => (

  <View style={styles.container}>
    <View style={styles.box}>
      <Text style={styles.text}>Pose 1</Text>
    </View>
    <View style={styles.box} href="/src/App.js">
      <Text style={styles.text}>Pose 2</Text>
    </View>
    <View style={styles.box} >
      <Text style={styles.text}>Pose 3</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header:{
    fontSize: 25,
  },
  container: {
    flex: 1,
    backgroundColor: "#25274D",
  },
  box: {
    top: 120,
    left: 120,
    width: 100,
    height: 100,
    backgroundColor: '#464866',
  },
  text: {
    color: '#FFF',
    fontSize: 20,
  },
});

export default registerRootComponent(App);
