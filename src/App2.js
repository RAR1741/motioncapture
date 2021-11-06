import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

//Tensorflow
import '@tensorflow/tfjs-react-native';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/pose';

//Drawing and Rendering Utilities
// import {draw, drawKeypoint, drawSkeleton} from "./utilities";
import Canvas from 'react-native-canvas';

//Expo
import { Camera } from 'expo-camera';
import { GLView } from 'expo-gl';
import { Interface } from 'readline';

interface ScreenProps {
    returnToMain: () => void;
  }
  
  interface ScreenState {
    hasCameraPermission?: boolean;
    // tslint:disable-next-line: no-any
    cameraType: any;
    isLoading: boolean;
    posenetModel?: posenet.PoseNet;
    pose?: posenet.Pose;
    // tslint:disable-next-line: no-any
    faceDetector?: any;
    faces?: blazeface.NormalizedFace[];
    modelName: string;
  }

const inputTensorWidth = 152;
const inputTensorHeight = 200;

const TensorCamera = cameraWithTensors(Camera);

class PoseDetector extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      cameraType: Camera.Constants.Type.front,
      modelName: 'blazepose',
    };
    this.handleImageTensorReady = this.handleImageTensorReady.bind(this);
  }

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

        // draw(poses, cameraTextureHeight, cameraTextureWidth, this.canvasRef);

        // if autorender is false you need the following two lines.
        //updatePreview();
        //gl.endFrameEXP();

        requestAnimation(loop);
      }
      loop();
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
        videoHeight={textureDims.height}
        videoWidth={textureDims.width}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        onReady={this.handleCameraStream}
        autorender={true}
        />        
      </View>
    }
  }

export default function App() {
  return (
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});