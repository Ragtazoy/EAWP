import React from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FooterEmp from "./components/FooterEmp";
import FooterMng from "./components/FooterMng";

//Screens
import Splash from './screens/Splash';
import AddEmp from "./screens/manager/AddEmp";
import Profile from "./screens/Profile";
import EditEmp from "./screens/manager/EditEmp";
import AddSchedule from "./screens/manager/AddSchedule";

const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export default function App() {
   return (
      <NavigationContainer>
         <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Employee" component={FooterMng} />
            <Stack.Screen name="AddEmp" component={AddEmp} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditEmp" component={EditEmp} />
            <Stack.Screen name="Scheldule" component={FooterMng} />
            <Stack.Screen name="AddSchedule" component={AddSchedule} />
         </Stack.Navigator>
      </NavigationContainer>
   );
}