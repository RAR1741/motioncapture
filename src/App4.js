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

const TensorCamera = cameraWithTensors(Camera);

class PoseDetector extends React.Component{

  constructor(props: ScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      cameraType: Camera.Constants.Type.front,
      modelName: 'posenet',
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

    // draw = (poses, videoHeight, videoWidth, canvas) => {
    //   const ctx = canvas.current.getContext("2d");
    //   canvas.current.width = videoWidth;
    //   canvas.current.height = videoHeight;
      
    //   drawKeypoint(poses.keypoints3D, 0.5, ctx);
    //   drawSkeleton(poses.keypoints3D, 0.5, ctx);
    // }

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
        {/* <Canvas
          ref={this.draw}
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
        /> */}
        
      </View>
    }
  }

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <PoseDetector>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
      </PoseDetector>
    </View>
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