import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, ScrollView, Divider, Heading, Text, Center, Button } from 'native-base'
import axios from 'axios'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons'
import Header from '../../components/Header'
import Cards from '../../components/Cards'
import LongCards from '../../components/LongCards'
import { Pressable } from 'react-native'

const Attendance = () => {
   const [item, setItem] = useState([])
   const [currentTime, setCurrentTime] = useState(moment().format('HH:mm:ss'))
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      console.log('id: ' + 1)
      axios.get('http://10.0.2.2:81/read/empdetail/' + 1).then((res) => {
         setItem(res.data)
         setIsLoading(false)
         console.log(item);
      })

      const interval = setInterval(() => {
         setCurrentTime(moment().format('HH:mm:ss'.toString()));
      }, 1000);
      return () => clearInterval(interval);
   }, [isLoading]);

   return (
      <NativeBaseProvider>
         <Header mode={'time'} title={'ลงเวลางาน'} subtitle={moment().format('dddd DD MMMM YYYY')} subtitle2={currentTime} />
         
         <Box flexDir={'row'} bgColor={'white'} m={5} p={2} shadow={4} borderRadius={15} >
            <Box flex={0.5} flexDir={'row'} alignItems={'center'}>
               <Icon name='ios-person-circle-outline' size={50} />
               <Box flex={1}>
                  <Text>{item.nname}</Text>
                  <Text color={'dark.300'} lineHeight={'sm'} fontSize={'xs'}>{item.fname + ' ' + item.lname}</Text>
               </Box>
            </Box>
            <Divider orientation="vertical" mx="1" />
            <Box flex={0.5} flexDir={'row'} alignItems={'center'}>
               <Icon name='ios-document-text-outline' size={45} />
               <Box flex={1}>
                  <Text>{item.job_title}</Text>
                  <Text color={'dark.300'} lineHeight={'sm'} fontSize={'xs'}>{item.line_account}</Text>
               </Box>
            </Box>
         </Box>

         <ScrollView>
            <Heading my={3} alignSelf={'center'}>งานวันนี้</Heading>
            <Box alignItems={'center'}>
               <Heading fontSize={'xl'}>ตำแหน่ง</Heading>
               <Text mx={2} mb={6}>พนักงาน {item.nname}</Text>
               <Button w={'48'} h={'48'} colorScheme={'success'} borderRadius={'full'} shadow={2} >
                  <Heading color={'white'} fontSize={'2xl'}>บันทึกเข้างาน</Heading>
               </Button>
            </Box>
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
      </NativeBaseProvider>
   )
}

export default Attendance