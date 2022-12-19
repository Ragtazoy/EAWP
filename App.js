import React from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FooterEmp from "./components/FooterEmp";
import FooterMng from "./components/FooterMng";

//Screens
import Splash from './screens/Splash';
import Home from './screens/Home';
import Login from './screens/Login';
import Profile from './screens/employee/Profile';
import Attendance from './screens/employee/Attendance';
import MyScrollView from './screens/MyScrollView';
import Employee from "./screens/manager/Employee";
import AddEmp from "./screens/manager/AddEmp";

const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export default function App() {
   return (
      <NavigationContainer>
         <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Employee" component={FooterMng} />
            <Stack.Screen name="AddEmp" component={AddEmp} />
         </Stack.Navigator>
         {/* <FooterMng /> */}
      </NavigationContainer>
      // <NavigationContainer>
      //    <Stack.Navigator>
      //       <Stack.Screen
      //          name="Splash"
      //          component={Splash}
      //          options={{ headerShown: false }}
      //       />
      //       <Stack.Screen
      //          name="Home"
      //          component={Home}
      //          options={{ headerShown: false }}
      //       />
      //       <Stack.Screen
      //          name="Login"
      //          component={Login}
      //          options={{ headerShown: false }}
      //       />
      //       <Stack.Screen
      //          name="Profile"
      //          component={Profile}
      //          options={{ headerShown: false }}
      //       />
      //       <Stack.Screen
      //          name="Attendance"
      //          component={Attendance}
      //          options={{ headerShown: false }}
      //       />
      //       <Stack.Screen
      //          name="MyScrollView"
      //          component={MyScrollView}
      //          options={{ headerShown: false }}
      //       />
      //       <Stack.Screen
      //          name="AddEmp"
      //          component={AddEmp}
      //          options={{ headerShown: false }}
      //       />
      //    </Stack.Navigator>
      // </NavigationContainer>
   );
}