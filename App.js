import React, {useRef} from 'react';
import { StyleSheet, Text, View ,TouchableOpacity,Platform, } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import Canvas from 'react-native-canvas';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native'
import * as posenet from "@tensorflow-models/posenet"
import { drawKeypoints, drawSkeleton } from "./utilities";
import MyComponent from './tensorCamera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Dimensions } from "react-native";
import Svg, { Circle, Rect, G, Line} from 'react-native-svg';

const dimensions = Dimensions.get("window");
const screenWidth = dimensions.width;
const height = Math.round((screenWidth * 16) / 9);


const TensorCamera = cameraWithTensors(Camera);
const inputTensorWidth = 152;
const inputTensorHeight = 200;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      cameraType: Camera.Constants.Type.front,
      model: null,
    };
    this.handleCameraStream = this.handleCameraStream.bind(this);
  }

  async componentDidMount(){
    await tf.ready();
    const net = await this.loadPosenetModel()
    this.setState({isLoading: false, model: net,})
  }

  async loadPosenetModel() {
    const net =  await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: { width: 390, height: 840 },
      multiplier: 0.75,
      quantBytes: 2
    });
    return net;
  }

  async handleCameraStream(images, updatePreview, gl) {
    const net =  await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: { width: inputTensorWidth, height: inputTensorHeight },
      multiplier: 0.75,
      quantBytes: 2
    });

    const loop = async () => {
      const imageTensor = images.next().value
      const flipHorizontal = false
      const pose = await net.estimateSinglePose(
        imageTensor, { flipHorizontal });
      this.setState({pose});
      tf.dispose([imageTensor]);

      //
      // do something with tensor here
      //

      // if autorender is false you need the following two lines.
      // updatePreview();
      // gl.endFrameEXP();

      requestAnimationFrame(loop);
    }
    loop();
  }

  renderPose(){
    const MIN_KEYPOINT_SCORE = 0.2;
    const {pose} = this.state;
    if (pose != null) {
    const keypoints = pose.keypoints
      .filter(k => k.score > MIN_KEYPOINT_SCORE)
      .map((k,i) => {
        return <Circle
          key={`skeletonkp_${i}`}
          cx={k.position.x}
          cy={k.position.y}
          r='2'
          strokeWidth='0'
          fill='blue'
        />;
      });

      const adjacentKeypoints =
      posenet.getAdjacentKeyPoints(pose.keypoints, MIN_KEYPOINT_SCORE);

      const skeleton = adjacentKeypoints.map(([from, to], i) => {
        return <Line
          key={`skeletonls_${i}`}
          x1={from.position.x}
          y1={from.position.y}
          x2={to.position.x}
          y2={to.position.y}
          stroke='magenta'
          strokeWidth='1'
        />;
      });

      return <Svg height='100%' width='100%'
        viewBox={`0 0 ${inputTensorWidth} ${inputTensorHeight}`}>
          {skeleton}
          {keypoints}
        </Svg>;
    } else {
      return null;
    }
  }

  render() {
    // Currently expo does not support automatically determining the
    // resolution of the camera texture used. So it must be determined
    // empirically for the supported devices and preview size.

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

    return <View style={{width:'100%', height:'100%'}}>
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
      <View style={styles.modelResults}>
        {this.renderPose()}
      </View>
    </View>
    
   }
}

const styles = StyleSheet.create({
  loadingIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 200,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  cameraContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  camera : {
    position:'absolute',
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    top: 0,
    width: '100%',
    height: height,
    zIndex: 9,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 0,
  },
  modelResults: {
    position:'absolute',
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    top: 0,
    width: '100%',
    height:height,
    zIndex: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 0,
  }
});