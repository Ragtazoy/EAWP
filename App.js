import React from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FooterEmp from "./components/FooterEmp";
import FooterMng from "./components/FooterMng";

//Screens
import Splash from './screens/Splash';
import Login from './screens/Login';

import AddEmp from "./screens/manager/AddEmp";
import ProfileMng from "./screens/manager/ProfileMng";
import EditEmp from "./screens/manager/EditEmp";
import AddSchedule from "./screens/manager/AddSchedule";
import EditSchedule from "./screens/manager/EditSchedule";
import AttendanceDetail from "./screens/manager/AttendanceDetail";

import QrScanner from "./screens/employee/QrScanner";

const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export default function App() {
   return (
      <NavigationContainer>
         <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Emp" component={FooterMng} />
            <Stack.Screen name="AddEmp" component={AddEmp} />
            <Stack.Screen name="ProfileMng" component={ProfileMng} />
            <Stack.Screen name="EditEmp" component={EditEmp} />
            <Stack.Screen name="Scheldule" component={FooterMng} />
            <Stack.Screen name="AddSchedule" component={AddSchedule} />
            <Stack.Screen name="EditSchedule" component={EditSchedule} />
            <Stack.Screen name="AttendanceMng" component={FooterMng} />
            <Stack.Screen name="AttendanceDetail" component={AttendanceDetail} />

            <Stack.Screen name="AttendanceEmp" component={FooterEmp} />
            <Stack.Screen name="QrScanner" component={QrScanner} />
            <Stack.Screen name="ScheduleEmp" component={FooterEmp} />

         </Stack.Navigator>
      </NavigationContainer>
   );
}

// import * as React from 'react';

// import { StyleSheet, Text } from 'react-native';
// import { useCameraDevices } from 'react-native-vision-camera';
// import { Camera } from 'react-native-vision-camera';
// import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

// export default function App() {
//   const [hasPermission, setHasPermission] = React.useState(false);
//   const devices = useCameraDevices();
//   const device = devices.back;

//   const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
//     checkInverted: true,
//   });

//   // Alternatively you can use the underlying function:
//   //
//   // const frameProcessor = useFrameProcessor((frame) => {
//   //   'worklet';
//   //   const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true });
//   //   runOnJS(setBarcodes)(detectedBarcodes);
//   // }, []);

//   React.useEffect(() => {
//     (async () => {
//       const status = await Camera.requestCameraPermission();
//       setHasPermission(status === 'authorized');
//     })();
//   }, []);

//   return (
//     device != null &&
//     hasPermission && (
//       <>
//         <Camera
//           style={StyleSheet.absoluteFill}
//           device={device}
//           isActive={true}
//           frameProcessor={frameProcessor}
//           frameProcessorFps={5}
//         />
//         {barcodes.map((barcode, idx) => (
//           <Text key={idx} style={styles.barcodeTextURL}>
//             {barcode.displayValue}
//           </Text>
//         ))}
//       </>
//     )
//   );
// }

// const styles = StyleSheet.create({
//   barcodeTextURL: {
//     fontSize: 20,
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });