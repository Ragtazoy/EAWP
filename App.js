import React, { useEffect } from "react";
import { requestUserPermission, notificationListener } from './screens/Notification'
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
import ReportWage from "./screens/manager/ReportWage";
import ReportAttend from "./screens/manager/ReportAttend";
import EvaluateDetail from "./screens/manager/EvaluateDetail";

import QrScanner from "./screens/employee/QrScanner";

const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

// notificationListener()
// notificationListener() ?
//    <NativeBaseProvider>
//       {Toast.show({
//          placement: "top",
//          render: () => {
//             return <HStack bgColor="#fbbf2440" px="3" py="2" rounded="md">
//                <Icon name='notification' color={'#fbbf24'} size={18} />
//                <Text ml={2} color={'#fbbf24'}>มีการแจ้งเตือนใหม่</Text>
//             </HStack>;
//          }
//       })}
//    </NativeBaseProvider> : null

export default function App() {
   useEffect(() => {
      notificationListener();
   }, []);

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
            <Stack.Screen name="ReportWage" component={ReportWage} />
            <Stack.Screen name="ReportAttend" component={ReportAttend} />
            <Stack.Screen name="EvaluateDetail" component={EvaluateDetail} />

            <Stack.Screen name="ScheduleEmp" component={FooterEmp} />
            <Stack.Screen name="AttendanceEmp" component={FooterEmp} />
            <Stack.Screen name="QrScanner" component={QrScanner} />

         </Stack.Navigator>
      </NavigationContainer>
   );
}