import React from 'react';
import { NativeBaseProvider, Box, Text, Pressable } from 'native-base'

const Splash = ({ navigation }) => {

    const onPress = () => {
        navigation.navigate('Employee')
    }

    return (
        <NativeBaseProvider>
            <Pressable onPress={onPress}>
                <Box h='100%' w='100%' bgColor='orange.500' alignItems='center'>
                    <Box flex='1' justifyContent='center' bgColor={'red.500'}>
                        <Text fontSize={'4xl'}>EAWP</Text>
                    </Box>
                </Box>
            </Pressable>
        </NativeBaseProvider>
    )
};

export default Splash