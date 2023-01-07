import React from 'react'
import { Box, Heading, HStack, IconButton, Center, Text } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faUserPlus, faUser, faCalendarDay } from '@fortawesome/free-solid-svg-icons'

const Header = ({ mode, icon, color, title, subtitle, element }) => {
   const navigation = useNavigation()

   return (
      <Box bgColor={'white'} shadow={3} px={4} py={6} borderBottomRadius={50}>
         {mode === 'text' ?
            <Center>
               <Heading alignSelf={'center'} mb={2}>{title}</Heading>
               <Text alignSelf={'center'} fontSize={'md'}>{subtitle}</Text>
            </Center>
            :
            <HStack justifyContent={'space-evenly'} alignItems={'center'}>
               <IconButton colorScheme='dark' variant={'outline'} borderRadius={'full'} boxSize={16} onPress={() => navigation.goBack()}>
                  <FontAwesomeIcon icon={faChevronLeft} color={'#a3a3a3'} size={22} />
               </IconButton>

               <Center>
                  <Center bgColor={color} borderRadius={'full'} w={20} h={20}>
                     <FontAwesomeIcon icon={icon === 'faUserPlus' ? faUserPlus : icon === 'faCalendarDay' ? faCalendarDay : faUser} color={'white'} size={40} />
                  </Center>
                  <Heading lineHeight={'sm'} alignSelf={'center'} mt={5}>{title}</Heading>
                  {!!subtitle ? <Text alignSelf={'center'} fontSize={'md'}>{subtitle}</Text> : null}
               </Center>

               {element}
            </HStack>
         }
      </Box>
   )
}

export default Header