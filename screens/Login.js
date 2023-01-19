import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Center, Box, Heading, VStack, FormControl, Input, Button, Pressable, Text } from 'native-base'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEye, faEyeSlash, faSignIn } from '@fortawesome/free-solid-svg-icons/'
// import ToastAlert from '../components/ToastAlert'

const Login = ({ navigation }) => {
   const [username, setUsername] = useState('')
   const [password, setpassword] = useState('')
   const [show, setShow] = useState(false)
   const [isInvalid, setIsInvalid] = useState(false)

   useEffect(() => {
      const checkLoginStatus = async () => {
         const isLoggedIn = await AsyncStorage.getItem('userId');
         console.log(isLoggedIn);
         if (isLoggedIn > 0) {
            console.log('loged in');
         } else {
            console.log('not loged in');
         }
      }

      checkLoginStatus()
   }, [])

   const handleLogin = async () => {
      await axios.post('http://10.0.2.2:81/login', {
         username: username,
         password: password
      }).then(res => {
         if (res.data.success) {
            // Save user ID to AsyncStorage
            AsyncStorage.setItem('userId', JSON.stringify(res.data.id));
            console.log(res.data.role);
            navigation.navigate(res.data.role == 'manager' ? 'AttendanceMng' : 'AttendanceEmp')
         } else {
            setIsInvalid(true)
         }
      }).catch(error => {
         console.error(error);
      });
   }


   return (
      <NativeBaseProvider>
         {/* <Text>{isLoggedIn}</Text> */}
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
                     <Input type={show ? "text" : "password"} value={password} onChangeText={e => setpassword(e)}
                        InputRightElement={
                           <Pressable onPress={() => setShow(!show)}>
                              <FontAwesomeIcon icon={show ? faEye : faEyeSlash} color='#a3a3a3' size={20} style={{ marginRight: 10 }} />
                           </Pressable>} placeholder="Password" />
                     {isInvalid && (<Text m={1} fontSize={'xs'} color={'error.500'}>ข้อมูลไม่ถูกต้อง</Text>)}
                  </FormControl>

                  <Button onPress={handleLogin} leftIcon={<FontAwesomeIcon icon={faSignIn} color='white' />} mt="2" colorScheme="amber">
                     Sign in
                  </Button>

                  {/* Sign Up */}
                  {/* <HStack mt="6" justifyContent="center">
							<Text fontSize="sm" color="coolGray.600">
								I'm a new user.{" "}
							</Text>
							<Link _text={{ color: "indigo.500", fontWeight: "medium", fontSize: "sm" }} href="#">
								Sign Up
							</Link>
						</HStack> */}
               </VStack>
            </Box>
         </Center>
      </NativeBaseProvider>
   )
};

export default Login