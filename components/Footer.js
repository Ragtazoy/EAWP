import React from 'react';
import { Text, Box, HStack, Pressable, Center, isPressed, isHovered } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faQrcode, faCalendarWeek, faExchange, faUser } from '@fortawesome/free-solid-svg-icons/'

const Footer = () => {
   return <Box safeAreaBottom={0} bgColor={'green.300'} width='100%' height='20' roundedTop='25' position={'absolute'} bottom={0} left={0} right={0}>
      <HStack space={3} justifyContent="center">

         <Pressable h="20" w="20" roundedTop="50" cursor="pointer" justifyContent='center' bg={isPressed ? 'red.200' : isHovered ? 'red.200' : 'yellow.100'}>
            <Center mt='1'>
               <FontAwesomeIcon icon={faQrcode} color='#7c2d12' size={40} />
               <Text color="orange.900" fontSize="sm">
                  Attendance
               </Text>
            </Center>
         </Pressable>
         <Pressable h="20" w="20" roundedTop="50" cursor="pointer" justifyContent='center' bg={isPressed ? 'red.200' : isHovered ? 'red.200' : 'yellow.100'}>
            <Center mt='1'>
               <FontAwesomeIcon icon={faCalendarWeek} color='#7c2d12' size={40} />
               <Text color="orange.900" fontSize="sm">
                  Schedule
               </Text>
            </Center>
         </Pressable>
         <Pressable h="20" w="20" roundedTop="50" cursor="pointer" justifyContent='center' bg={isPressed ? 'red.200' : isHovered ? 'red.200' : 'yellow.100'}>
            <Center mt='1'>
               <FontAwesomeIcon icon={faExchange} color='#7c2d12' size={40} />
               <Text color="orange.900" fontSize="sm">
                  Exchange
               </Text>
            </Center>
         </Pressable>
         <Pressable h="20" w="20" roundedTop="50" cursor="pointer" justifyContent='center' bg={isPressed ? 'red.200' : isHovered ? 'red.200' : 'yellow.100'}>
            <Center mt='1'>
               <FontAwesomeIcon icon={faUser} color='#7c2d12' size={40} />
               <Text color="orange.900" fontSize="sm">
                  Profile
               </Text>
            </Center>
         </Pressable>

      </HStack>;
   </Box>
}


export default Footer;