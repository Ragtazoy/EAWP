import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Center, Box, Heading, VStack, FormControl, Input, Button, Pressable, Text } from 'native-base'
import { requestUserPermission, notificationListener } from '../screens/Notification'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEye, faEyeSlash, faSignIn } from '@fortawesome/free-solid-svg-icons/'

const Login = ({ navigation }) => {
   const [isLoading, setIsLoading] = useState(true)
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [show, setShow] = useState(false)
   const [isInvalid, setIsInvalid] = useState(false)

   useEffect(() => {
      const checkLoginStatus = async () => {
         await navigation.addListener('focus', () => setIsLoading(true))

         const userId = await AsyncStorage.getItem('userId');
         if (userId > 0) {
            console.log('loged in');
            await axios.get('http://10.0.2.2:81/read/login/' + userId).then(async (res) => {
               await setUsername(res.data.nname)
               await setPassword(res.data.password)
               username !== '' ? handleLogin() : console.log('null');
            })
         } else {
            console.log('not loged in');
            await setUsername('')
            await setPassword('')
         }

         setIsLoading(false)
      }

      setIsInvalid(false)
      requestUserPermission()
      checkLoginStatus()
   }, [isLoading])


   const handleLogin = async () => {
      console.log('handleLogin:', username, password);
      await axios.post('http://10.0.2.2:81/login', {
         username: username,
         password: password
      }).then(async (res) => {
         if (res.data.success) {
            // Save user device token
            const deviceToken = await AsyncStorage.getItem('fcmToken')
            console.log('Save user device token:', res.data.id, deviceToken);
            await axios.put('http://10.0.2.2:81/update/device_token', {
               emp_id: res.data.id,
               device_token: deviceToken
            })

            // Save user ID to AsyncStorage
            await AsyncStorage.setItem('userId', JSON.stringify(res.data.id));
            console.log(res.data.role);

            if (res.data.role == 'manager') {
               navigation.navigate('AttendanceMng')
            } else {
               navigation.navigate('ScheduleEmp')
            }
         } else {
            setIsInvalid(true)
         }
      }).catch(error => {
         console.error(error);
      });
   }

   const handleFCM = async () => {
      await axios.post('http://10.0.2.2:81/send-notification', {
         deviceToken: 'dYMkxp6ISBCtknAZy84qom:APA91bHIPdXflIciAIzX58Mgiqts8fIS2nQkgtDLJNyBMznwJ9rXXunZVrzO9JWhXHGCC3LWnnjucbdLpAEFmmVoxadHf_q6FYsafTAWccFrQElFEtqvM7pDPdTiz3M486u17EK32QEa',
         notification: {
            title: 'Test',
            body: 'Notification Body',
         },
         data: {
            id: moment().format('x').toString()
         }
      })
   }


   return (
      <NativeBaseProvider>
         <Center flex={1} w="100%" alignItems='center' justifyItems='center'>
            <Box safeArea={true} w="80%">

               <Heading lineHeight={'xs'} size="lg" fontWeight="600" color="coolGray.800">
                  Welcome
               </Heading>

               <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
                  Sign in to continue!
               </Heading>

               <VStack space={3} mt="5">

                  <FormControl isInvalid={isInvalid}>
                     <FormControl.Label>Username</FormControl.Label>
                     <Input type="text" value={username} onChangeText={e => setUsername(e)} placeholder="Username" />
                  </FormControl>

                  <FormControl isInvalid={isInvalid}>
                     <FormControl.Label>Password</FormControl.Label>
                     <Input type={show ? "text" : "password"} value={password} onChangeText={e => setPassword(e)}
                        InputRightElement={
                           <Pressable onPress={() => setShow(!show)}>
                              <FontAwesomeIcon icon={show ? faEye : faEyeSlash} color='#a3a3a3' size={20} style={{ marginRight: 10 }} />
                           </Pressable>} placeholder="Password" />
                     {isInvalid && (<Text m={1} fontSize={'xs'} color={'error.500'}>ข้อมูลไม่ถูกต้อง</Text>)}
                  </FormControl>

                  <Button onPress={handleLogin} leftIcon={<FontAwesomeIcon icon={faSignIn} color='white' />} mt="2" colorScheme="amber">
                     Sign in
                  </Button>

               </VStack>

            </Box>
         </Center>
      </NativeBaseProvider>
   )
};

export default Login