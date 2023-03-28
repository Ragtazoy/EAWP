import { NativeBaseProvider, Toast, HStack, Text } from 'native-base';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign'

export const requestUserPermission = async () => {
   const authStatus = await messaging().requestPermission();
   const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

   if (enabled) {
      console.log('Authorization status:', authStatus);
      getFCMToken();
   }
}

async function getFCMToken() {
   let fcmToken = await AsyncStorage.getItem("fcmToken");
   if (!fcmToken) {
      try {
         const fcmToken = await messaging().getToken();
         if (fcmToken) {
            console.log('new token', fcmToken);
            await AsyncStorage.setItem('fcmToken', fcmToken);
         }
      } catch (error) {
         console.log('error in fcmToken:', error);
      }
   }
}

export const notificationListener = () => {

   // Assume a message-notification contains a "type" property in the data payload of the screen to open

   messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
         'Notification caused app to open from background state:',
         remoteMessage.notification
      );
      // navigation.navigate(remoteMessage.data.type);
   });

   // Check whether an initial notification is available
   messaging().getInitialNotification()
      .then(remoteMessage => {
         if (remoteMessage) {
            console.log('Notification caused app to open from quit state:', remoteMessage.notification);
         }
      });

   messaging().onMessage(async remoteMessage => {
      console.log('Notification on foreground state...', remoteMessage);
      <NativeBaseProvider>
         {Toast.show({
            placement: "top",
            render: () => {
               return <HStack bgColor="#fbbf24" px="2" py="2" rounded="full" borderColor={'#e1ab20'} borderWidth={1}>
                  <Icon name='notification' color={'black'} size={18} />
                  <Text ml={2} color={'#black'}>มีการแจ้งเตือนใหม่</Text>
               </HStack>;
            }
         })}
      </NativeBaseProvider>
      // return true
   })

}