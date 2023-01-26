import React from 'react'
import { Box, Heading, Text } from 'native-base'
import Icon from 'react-native-vector-icons/AntDesign'

const LongCards = ({ mode, select, txt1, txt2, txt3 }) => {
   return (
      <Box>
         {
            mode === 'mng' ? (
               <Box w={220} minHeight={'full'} p={3} bgColor={'#7c2d12'} shadow={1} borderRadius={10} justifyContent={'center'}>
                  <Heading fontSize={'xl'} color={'#fcd34d'}>{txt1}</Heading>
                  <Text mb={2} fontSize={'lg'} color={'white'}>{txt2}</Text>
                  <Heading mt={3} fontSize={'xl'} color={'#fcd34d'}>{txt3}</Heading>
               </Box>
            ) : null

         }

         {/* {
            mode === 'mng-add' ? (
               <Box w={140} minHeight={'full'} p={3} bgColor={'#d4d4d4'} shadow={1} borderRadius={10} justifyContent={'center'} alignItems={'center'}>
                  <Icon name='plus' size={30} />
                  <Heading lineHeight={'xs'} fontSize={'lg'}>{txt1}</Heading>
               </Box>
            ) : mode === 'mng' ? (
               select === true ? (
                  <Box w={220} minHeight={'full'} p={3} bgColor={'#7c2d12'} shadow={1} borderRadius={10} justifyContent={'center'} alignItems={'flex-start'}>
                     <Heading lineHeight={'sm'} fontSize={'lg'} color={'#fcd34d'}>{txt1}</Heading>
                     <Text mb={2} lineHeight={'sm'} fontSize={'sm'} color={'white'}>{txt2}</Text>
                     <Heading lineHeight={'xs'} fontSize={'lg'} color={'white'}>{txt3}</Heading>
                  </Box>
               ) : (
                  null
               )
            ) : (
               null
            )
         } */}
      </Box>
   )
}

export default LongCards