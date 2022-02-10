import React, { useEffect, useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function ModelService() {
    const model = await tf.loadGraphModel(/*modelURL*/);

    const classifyPose = async (jsonArray) => { 
        //use model to predict
        const modelUrl ='https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json';
        const model = await tf.loadGraphModel(modelUrl);
        const zeros = tf.zeros([1, 224, 224, 3]);
        model.predict(zeros).print();
        return 
          
        
    }
}