import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Center, Box, Heading, VStack, FormControl, Input, Button, Pressable } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEye, faEyeSlash, faSignIn } from '@fortawesome/free-solid-svg-icons/'

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setpassword] = useState('')
    const [show, setShow] = useState(false);

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

                        <Button leftIcon={<FontAwesomeIcon icon={faSignIn} color='white' />} mt="2" colorScheme="orange">
                            Sign in
                        </Button>

                        {/* Sign Up */}
                        {/* <HStack mt="6" justifyContent="center">
                            <Text fontSize="sm" color="coolGray.600">
                                I'm a new user.{" "}
                            </Text>
                            <Link _text={{
                                color: "indigo.500",
                                fontWeight: "medium",
                                fontSize: "sm"
                            }} href="#">
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