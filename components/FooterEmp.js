import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeBaseProvider } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faQrcode, faCalendarWeek, faExchange, faUser } from '@fortawesome/free-solid-svg-icons/'

// Screens
import Attendance from '../screens/employee/Attendance';
import Schedule from '../screens/employee/Schedule';
import Exchange from '../screens/employee/Exchange';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

const Footer = () => {
   return <NativeBaseProvider>
      <NavigationContainer>
         <Tab.Navigator
            initialRouteName="Attendance"
            screenOptions={{
               tabBarActiveTintColor: 'white',
               tabBarInactiveTintColor: '#7c2d12',
               tabBarActiveBackgroundColor: '#7c2d12',
               tabBarInactiveBackgroundColor: 'white',
               tabBarStyle: { height: 65 },
               tabBarLabelStyle: { paddingBottom: 5, fontSize: 12 },
               headerShown: false
            }}
         >
            <Tab.Screen
               name="Attendance" component={Attendance}
               options={{
                  tabBarLabel: 'Attendance',
                  tabBarIcon: ({ color, size }) => (
                     <FontAwesomeIcon icon={faQrcode} color={color} size={30} />
                  ),
               }}
            />
            <Tab.Screen
               name="Schedule" component={Schedule}
               options={{
                  tabBarLabel: 'Schedule',
                  tabBarIcon: ({ color, size }) => (
                     <FontAwesomeIcon icon={faCalendarWeek} color={color} size={30} />
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
               name="Profile" component={Profile}
               options={{
                  tabBarLabel: 'Profile',
                  tabBarIcon: ({ color, size }) => (
                     <FontAwesomeIcon icon={faUser} color={color} size={30} />
                  ),
               }}
            />
         </Tab.Navigator>
      </NavigationContainer>
   </NativeBaseProvider>
}

export default Footer;