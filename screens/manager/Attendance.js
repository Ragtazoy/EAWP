import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, ScrollView, Text, Flex } from 'native-base'

const Attendance = () => {
   return (
      <NativeBaseProvider>
         <Flex flex={1}>
            <ScrollView>
               <Box bgColor={'red.300'} p={5}> Attendance </Box>
               <Box bgColor={'blue.300'} h={20} my={5}></Box>
               <Box bgColor={'blue.300'} h={20} my={5}></Box>
               <Box bgColor={'blue.300'} h={20} my={5}></Box>
               <Box bgColor={'blue.300'} h={20} my={5}></Box>
               <Box bgColor={'blue.300'} h={20} my={5}></Box>
               <Box bgColor={'blue.300'} h={20} my={5}></Box>
               <Box bgColor={'blue.300'} h={20} my={5}></Box>
               <Box bgColor={'blue.300'} h={20} my={5}></Box>
               <Box bgColor={'blue.300'} h={20} my={5}></Box>
               <Box bgColor={'amber.300'} h={60} my={5}></Box>
            </ScrollView>
         </Flex>
      </NativeBaseProvider>
   )
}

export default Attendance