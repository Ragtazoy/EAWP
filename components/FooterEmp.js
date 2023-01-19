import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeBaseProvider } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faQrcode, faCalendarWeek, faExchange, faUser } from '@fortawesome/free-solid-svg-icons/'

// Screens
import AttendanceEmp from '../screens/employee/AttendanceEmp';
import ScheduleEmp from '../screens/employee/ScheduleEmp';
import Exchange from '../screens/employee/Exchange';
import ProfileEmp from '../screens/employee/ProfileEmp';

const Tab = createBottomTabNavigator();

const Footer = () => {
   return <NativeBaseProvider>
      <Tab.Navigator
         initialRouteName="ScheduleEmp"
         screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#7c2d12',
            tabBarActiveBackgroundColor: '#7c2d12',
            tabBarInactiveBackgroundColor: 'white',
            tabBarStyle: { height: 80, borderRadius: 50 },
            tabBarItemStyle: { borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 10 },
            tabBarLabelStyle: { paddingBottom: 5, fontSize: 12 },
            headerShown: false
         }}
      >
         <Tab.Screen
            name="ScheduleEmp" component={ScheduleEmp}
            options={{
               tabBarLabel: 'Schedule',
               tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon icon={faCalendarWeek} color={color} size={30} />
               ),
            }}
         />
         <Tab.Screen
            name="AttendanceEmp" component={AttendanceEmp}
            options={{
               tabBarLabel: 'Attendance',
               tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon icon={faQrcode} color={color} size={30} />
               ),
            }}
         />
         <Tab.Screen
            name="Exchange" component={Exchange}
            options={{
               tabBarLabel: 'Exchange',
               tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon icon={faExchange} color={color} size={30} />
               ),
            }}
         />
         <Tab.Screen
            name="ProfileEmp" component={ProfileEmp}
            options={{
               tabBarLabel: 'Profile',
               tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon icon={faUser} color={color} size={30} />
               ),
            }}
         />
      </Tab.Navigator>
   </NativeBaseProvider>
}

export default Footer;