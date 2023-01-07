import React from 'react'
import { Box, Text } from 'native-base'

const DayCards = ({ color, txtColor, day1, day2 }) => {
   return (
         <Box borderRadius={20} bgColor={'red.500'} w={20} h={20} justifyContent={'center'} alignItems={'center'}>
            <Text lineHeight={'xs'} fontSize={'lg'}>25</Text>
            <Text lineHeight={'xs'} fontSize={'sm'}>Mo</Text>
            {/* <Box m={1} p={1} borderRadius={'full'} bgColor={'green.300'}></Box> */}
         </Box>

   )
}

export default DayCards