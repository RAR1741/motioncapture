import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import PoseTrainer from './src/PoseTrainer';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(PoseTrainer);
