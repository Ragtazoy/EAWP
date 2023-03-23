import React from 'react';
import { NativeBaseProvider, Box, Text, Pressable, Heading } from 'native-base'

const Splash = ({ navigation }) => {

   const onPress = () => {
      navigation.navigate('Login')
   }

   return (
      <NativeBaseProvider>
         <Pressable onPress={onPress}>
            <Box h='100%' w='100%' bgColor='orange.500' alignItems='center'>
               <Box flex='1' justifyContent='center' alignItems={'center'} p={10}>
                  <Heading textAlign={'center'} fontSize={'3xl'} color={'white'}>ระบบจัดการการเข้างานและการจ่ายค่าจ้างพนักงานร้าน</Heading>
                  <Heading textAlign={'center'} fontSize={'3xl'}>
                     <Text color={'#7c2d12'}>ย่างเนย</Text>
                     <Text color={'amber.300'}>คลองหก</Text>
                  </Heading>
               </Box>
            </Box>
         </Pressable>
      </NativeBaseProvider>
   )
};

export default Splash