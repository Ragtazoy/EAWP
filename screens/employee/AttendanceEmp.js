import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Spinner, Divider, Heading, Text, Button, HStack } from 'native-base'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import AwesomeAlert from 'react-native-awesome-alerts'

import Icon from 'react-native-vector-icons/Ionicons'
import Header from '../../components/Header'
import Modal from '../../components/Modal'

const AttendanceEmp = ({ navigation }) => {
   const [item, setItem] = useState([])
   const [workSchedule, setWorkSchedule] = useState([])
   const [workAttendance, setWorkAttendance] = useState([])
   const [currentTime, setCurrentTime] = useState(moment().format('HH:mm:ss'))
   const [isLoading, setIsLoading] = useState(true)

   const [showAlert, setshowAlert] = useState(false)

   useEffect(() => {
      (async () => {
         const userId = await AsyncStorage.getItem('userId');
         console.log('id: ' + userId);

         axios.get('http://10.0.2.2:81/read/empdetail/' + userId).then((res) => {
            setItem(res.data)
         })

         await axios.get('http://10.0.2.2:81/read/a_emp_in_scheduling', {
            params: { emp_id: userId, sched_date: moment().format('YYYY-MM-DD') }
         }).then((res) => {
            setWorkSchedule(res.data)
         })

         await axios.get('http://10.0.2.2:81/read/work_attendance', {
            params: { sched_id: workSchedule['sched_id'] }
         }).then((res) => {
            const arrByID = res.data.filter((item) => { return (item['emp_id'] == userId) })
            setWorkAttendance(arrByID)
         })

         console.log('workSchedule ', workSchedule);
         console.log('workAttendance ', workAttendance);
         setIsLoading(false)
      })()

      const interval = setInterval(() => {
         setCurrentTime(moment().format('HH:mm:ss'));
      }, 1000);
      return () => clearInterval(interval);

   }, [isLoading]);

   const checkIn = async () => {
      const timeIn = await moment()
      const timeFix = await moment().hours(16).minutes(0).seconds(0)
      const timeDiff = timeIn.diff(timeFix)
      console.log(timeDiff);
      if (timeDiff < 3600000) {
         navigation.navigate('QrScanner', { id: workSchedule.emp_id, sched_id: workSchedule.sched_id })
      } else {
         setshowAlert(true)
      }
   }

   const checkOut = () => {
      console.log('CHECK OUT');
   }

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
            workSchedule !== '' ? (
               workAttendance.length === 0 ? (
                  <Box alignItems={'center'}>
                     <Heading fontSize={'xl'}>ตำแหน่ง: {workSchedule.dept_name}</Heading>
                     <Text mx={2} mb={6}>พนักงาน {workSchedule.nname}</Text>
                     <Button w={'48'} h={'48'} colorScheme={'success'} borderRadius={'full'} shadow={2}
                        onPress={checkIn} >
                        <Heading color={'white'} fontSize={'2xl'}>บันทึกเข้างาน</Heading>
                     </Button>
                  </Box>
               ) : (
                  <Box alignItems={'center'}>
                     <Heading fontSize={'xl'}>ตำแหน่ง: {workSchedule.dept_name}</Heading>
                     <Text mx={2} mb={6}>พนักงาน {workSchedule.nname}</Text>
                     <Button w={'48'} h={'48'} colorScheme={'info'} borderRadius={'full'} shadow={2}
                        onPress={checkOut} >
                        <Heading color={'white'} fontSize={'2xl'}>บันทึกออกงาน</Heading>
                     </Button>
                  </Box>
               )
            ) : (
               <Heading alignSelf={'center'} mt={5} color={'orange.900'}>ไม่มี</Heading>)
         ) : (
            <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
               <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
               <Heading color="#7c2d12" fontSize="md">
                  กำลังโหลดข้อมูล
               </Heading>
            </HStack>
         )}

         <AwesomeAlert
            show={showAlert}
            customView={<Modal mode={'warning'} title={'ยังไม่ถึงเวลาเข้างาน'} />}
            contentContainerStyle={{ width: '80%' }}
            onDismiss={() => { setshowAlert(false) }}
         />
      </NativeBaseProvider>
   )
}

export default AttendanceEmp