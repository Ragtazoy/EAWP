import 'react-native-reanimated'
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

process.env.SERVER = "http://10.0.2.2:81"

console.disableYellowBox = true;

messaging().setBackgroundMessageHandler(async remoteMessage => {
   console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);