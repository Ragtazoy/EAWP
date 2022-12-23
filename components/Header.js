import React from 'react'
import { Box, Heading, HStack, IconButton, Center } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-regular-svg-icons'

const Header = ({ icon, color, title, element }) => {
   const navigation = useNavigation()

   return (
      <Box bgColor={'white'} shadow={3} px={4} py={6} borderBottomRadius={50} >
         <HStack justifyContent={'space-evenly'} alignItems={'center'}>
            <IconButton colorScheme='dark' variant={'outline'} borderRadius={'full'} boxSize={16} onPress={() => navigation.goBack()}>
               <FontAwesomeIcon icon={faChevronLeft} color={'#a3a3a3'} size={22} />
            </IconButton>
            <Center bgColor={color} borderRadius={'full'} w={20} h={20}>
               <FontAwesomeIcon icon={icon === 'faUserPlus' ? faUserPlus : faSave} color={'white'} size={40} />
            </Center>
            {element}
         </HStack>
         <Heading alignSelf={'center'} mt={5}>{title}</Heading>
      </Box>
   )
}

export default Header