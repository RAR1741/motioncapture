import React from 'react';
import { View } from 'react-native';
import PoseTrainer from '../src/PoseTrainer';
import PoseTracker from "./PoseTracker";

export default function App() {
  return (
    <View>
      <PoseTrainer
        training_server_url={'http://3.20.237.206/pose_handler.php'}
      />
    </View>
  );
}