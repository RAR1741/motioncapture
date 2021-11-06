import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

//Tensorflow
import '@tensorflow/tfjs-react-native';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/pose';

//Drawing Utilities
import {draw, drawKeypoint, drawSkeleton} from "./utilities";

//Expo
import { Camera } from 'expo-camera';


const TensorCamera = cameraWithTensors(Camera);

class PoseDetector extends React.Component{

    handleCameraStream(images, updatePreview, gl) {
      const loop = async () => {
        const nextImageTensor = images.next().value

        const model = poseDetection.SupportedModels.BlazePose;
        const detectorConfig = {
          runtime: 'tfjs',
          enableSmoothing: true,
          modelType: 'full'
        };
        detector = await poseDetection.createDetector(model, detectorConfig);
        const estimationConfig = {flipHorizontal: true};
        const timestamp = performance.now();
        const poses = await detector.estimatePoses(nextImageTensor, estimationConfig, timestamp);

        draw(poses, cameraTextureHeight, cameraTextureWidth, this.canvasRef);

        // if autorender is false you need the following two lines.
        //updatePreview();
        //gl.endFrameEXP();

        requestAnimation(loop);
      }
      loop();
    }

    draw = (poses, videoHeight, videoWidth, canvas) => {
      const ctx = canvas.current.getContext("2d");
      canvas.current.width = videoWidth;
      canvas.current.height = videoHeight;
      
      drawKeypoint(poses.keypoints, 0.5, ctx);
      drawSkeleton(poses.keypoints, 0.5, ctx);
    }

    render() {
      let textureDims;
      if (Platform.OS === 'ios') {
      textureDims = {
        height: 1920,
        width: 1080,
      };
      } else {
      textureDims = {
        height: 1200,
        width: 1600,
      };
      }

      return <View>
        <TensorCamera
        // Standard Camera props
        style={styles.camera}
        type={Camera.Constants.Type.front}
        // Tensor related props
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        onReady={this.handleCameraStream}
        autorender={true}
        />
        <canvas
          ref={this.canvasRef}
          style={
            width=textureDims.width,
            height=textureDims.height,
            {
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
          }}
        />
      </View>
    }
  }

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <PoseDetector></PoseDetector>
        <Text>Michael is a nigger</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});