import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeBaseProvider, Box, ScrollView, Text, Flex } from 'native-base'
import Footer from '../../components/FooterEmp';

const EmpProfile = () => {

   const [user, setUser] = useState({})
   const [isLoading, setIsLoading] = useState(true)

   const fetchUser = async () => {
      const accessToken = await AsyncStorage.getItem('@acessToken')
      const response = await fetch('https://www.melivecode.com/api/auth/user', {
         method: 'GET',
         headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
      })
      const data = await response.json()
      setUser(data.user)
      setIsLoading(false)
   }

   useEffect(() => {
      fetchUser()
   }, [isLoading])

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
               <Box bgColor={'blue.300'} h={20} my={5}>Profile</Box>
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

export default EmpProfile