import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, ScrollView, Text, Flex, View } from 'native-base'

const Attendance = () => {
   const [isLoading, setIsLoading] = useState(true)

   return (
      <NativeBaseProvider>
         <Flex flex={1}>
            <ScrollView>
               {isLoading ? <Text>Loading</Text> :
                  <Box>
                     {/* <Text>{user.fname} {user.lname}</Text>
               <Text>{user.email}</Text> */}
                  </Box>
               }
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