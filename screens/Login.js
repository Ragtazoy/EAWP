import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeBaseProvider, Center, Box, Heading, VStack, FormControl, Input, Button, Pressable, Toast } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEye, faEyeSlash, faSignIn } from '@fortawesome/free-solid-svg-icons/'
import ToastAlert from '../components/ToastAlert';

const Login = ({ navigation }) => {

   const [username, setUsername] = useState('')
   const [password, setpassword] = useState('')
   const [show, setShow] = useState(false);

   const handleLogin = async () => {
      const response = await fetch('https://www.melivecode.com/api/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            username: username,
            password: password,
            expiresIn: 60000
         })
      })
      const data = await response.json()
      if (data.status === 'ok') {
         await AsyncStorage.setItem('@acessToken', data.accessToken)
         const accessToken = await AsyncStorage.getItem('@acessToken')
         navigation.navigate('Profile')
      } else {
         Toast.show({
            render: () => {
               return <ToastAlert
                  status={'error'}
                  title={data.status}
                  variant={"top-accent"}
                  description={data.message}
               />;
            }
         })
         // Toast.show({
         // 	title: data.status,
         // 	variant: "top-accent",
         // 	description: data.message,
         // })
      }
   }

   return (
      <NativeBaseProvider>
         <Center flex={1} w="100%" alignItems='center' justifyItems='center'>
            <Box safeArea py="8" w="80%">
               <Heading size="lg" fontWeight="600" color="coolGray.800">
                  Welcome
               </Heading>
               <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
                  Sign in to continue!
               </Heading>

               <VStack space={3} mt="5">
                  <FormControl>
                     <FormControl.Label>Username</FormControl.Label>
                     <Input type="text" value={username} onChangeText={e => setUsername(e)} placeholder="Username" />
                  </FormControl>
                  <FormControl>
                     <FormControl.Label>Password</FormControl.Label>
                     <Input type={show ? "text" : "password"} value={password} onChangeText={e => setpassword(e)}
                        InputRightElement={
                           <Pressable onPress={() => setShow(!show)}>
                              <FontAwesomeIcon icon={show ? faEye : faEyeSlash} color='#a3a3a3' size={20} style={{ marginRight: 10 }} />
                           </Pressable>} placeholder="Password" />
                  </FormControl>

                  <Button onPress={handleLogin} leftIcon={<FontAwesomeIcon icon={faSignIn} color='white' />} mt="2" colorScheme="orange">
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