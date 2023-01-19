import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Spinner, Divider, Heading, Text, Button, HStack } from 'native-base'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons'
import Header from '../../components/Header'

const AttendanceEmp = ({ navigation }) => {
   const [item, setItem] = useState([])
   const [workSchedule, setWorkSchedule] = useState([])
   const [currentTime, setCurrentTime] = useState(moment().format('HH:mm:ss'))
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      (async () => {
         const userId = await AsyncStorage.getItem('userId');
         console.log('id: ' + userId);

         axios.get('http://10.0.2.2:81/read/empdetail/' + userId).then((res) => {
            setItem(res.data)
            console.log(res.data);
         })

         await axios.get('http://10.0.2.2:81/read/a_emp_in_scheduling', {
            params: { emp_id: userId, sched_date: moment().format('YYYY-MM-DD') }
         }).then((res) => {
            setWorkSchedule(res.data)
         })

         console.log('workSchedule ', workSchedule.length !== 0);
         setIsLoading(false)
      })()

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
                  <Text color={'dark.300'} lineHeight={'sm'} fontSize={'xs'}>{item.dept}</Text>
               </Box>
            </Box>
         </Box>

         <Heading my={3} alignSelf={'center'}>งานวันนี้</Heading>
         {!isLoading ? (
            workSchedule.length !== 0 ? (
               <Box alignItems={'center'}>
                  <Heading fontSize={'xl'}>ตำแหน่ง: {workSchedule.dept_name}</Heading>
                  <Text mx={2} mb={6}>พนักงาน {workSchedule.nname}</Text>
                  <Button w={'48'} h={'48'} colorScheme={'success'} borderRadius={'full'} shadow={2}
                     onPress={() => { navigation.navigate('QrScanner', { id: workSchedule.emp_id, sched_id: workSchedule.sched_id }) }} >
                     <Heading color={'white'} fontSize={'2xl'}>บันทึกเข้างาน</Heading>
                  </Button>
               </Box>
            ) : <Heading alignSelf={'center'} mt={5} color={'orange.900'}>ไม่มี</Heading>
         ) : (
            <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
               <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
               <Heading color="#7c2d12" fontSize="md">
                  กำลังโหลดข้อมูล
               </Heading>
            </HStack>
         )}
      </NativeBaseProvider>
   )
}

export default AttendanceEmp