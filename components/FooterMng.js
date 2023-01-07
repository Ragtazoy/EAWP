import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeBaseProvider } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPeopleGroup, faCalendarCheck, faCalendarWeek, faClipboardList, faStar } from '@fortawesome/free-solid-svg-icons/'

// Screens
import Emp from '../screens/manager/Emp';
import Schedule from '../screens/manager/Schedule';
import Attendance from '../screens/manager/Attendance';
import Report from '../screens/manager/Report';
import Evaluate from '../screens/manager/Evaluate';

const Tab = createBottomTabNavigator();

const Footer = () => {
   return <NativeBaseProvider>
      <Tab.Navigator
         initialRouteName="Employee"
         screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#7c2d12',
            tabBarActiveBackgroundColor: '#7c2d12',
            tabBarInactiveBackgroundColor: 'white',
            tabBarStyle: { height: 80, borderRadius: 50 },
            tabBarItemStyle: { borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingTop: 10 },
            tabBarLabelStyle: { paddingBottom: 5, fontSize: 12 },
            headerShown: false
         }}
      >
         <Tab.Screen
            name="Emp" component={Emp}
            options={{
               tabBarLabel: 'Employee',
               tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon icon={faPeopleGroup} color={color} size={38} />
               ),
            }}
         />
         <Tab.Screen
            name="Schedule" component={Schedule}
            options={{
               tabBarLabel: 'Schedule',
               tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon icon={faCalendarCheck} color={color} size={30} />
               ),
            }}
         />
         <Tab.Screen
            name="Attendance" component={Attendance}
            options={{
               tabBarLabel: 'Attendance',
               tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon icon={faCalendarWeek} color={color} size={30} />
               ),
            }}
         />
         <Tab.Screen
            name="Report" component={Report}
            options={{
               tabBarLabel: 'Report',
               tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon icon={faClipboardList} color={color} size={30} />
               ),
            }}
         />
         <Tab.Screen
            name="Evaluate" component={Evaluate}
            options={{
               tabBarLabel: 'Evaluate',
               tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon icon={faStar} color={color} size={30} />
               ),
            }}
         />
      </Tab.Navigator>
   </NativeBaseProvider>
}

export default Footer;