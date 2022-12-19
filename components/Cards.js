import React from 'react'
import { NativeBaseProvider, Box, Heading } from 'native-base'

const Cards = ({ color, text, heading }) => {
   return (
      <NativeBaseProvider>
         <Box bgColor={color} shadow={4} px={4} py={6} borderRadius={25} >
            <Heading fontSize={'md'}>{text}</Heading>
            <Heading fontSize={'4xl'}>{heading}</Heading>
         </Box>
      </NativeBaseProvider>
   )
}

export default Cards