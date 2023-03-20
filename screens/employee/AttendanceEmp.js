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
   const [wage, setWage] = useState(0)

   const [currentTime, setCurrentTime] = useState(moment().format('HH:mm:ss'))
   const [isLoading, setIsLoading] = useState(true)

   const [showAlert, setShowAlert] = useState({ show: false, text: "" })
   const [showConfirm, setShowConfirm] = useState(false)
   const [showSuccess, setShowSuccess] = useState(false)

   useEffect(() => {
      (async () => {
         await navigation.addListener('focus', () => setIsLoading(true))
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
      const timeIn = await +moment()
      const timeFix = await +moment().hours(16).minutes(0).seconds(0)
      const timeDiff = timeFix - timeIn
      console.log(timeDiff);
      if (timeDiff > 3600000) {
         setShowAlert({ show: true, text: "ยังไม่ถึงเวลาเข้างาน" })
      } else if (timeDiff > -7200000) {
         navigation.navigate('QrScanner', { id: workSchedule.emp_id, sched_id: workSchedule.sched_id })
      } else {
         setShowAlert({ show: true, text: "เลยเวลาเข้างาน" })
      }
   }

   const checkOut = async () => {
      const timeOut = await moment().format('YYYY-MM-DD HH:mm:ss')
      const jobMillisec = await +moment(timeOut) - +moment(workAttendance[0].time_in)
      const jobHours = await moment.duration(jobMillisec).hours()
      await setWage(wage => wage = jobHours * 300)
      console.log(moment(workAttendance[0].time_in), moment(timeOut));
      console.log(jobMillisec);
      console.log(jobHours);

      await axios.put('http://10.0.2.2:81/update/work_attendance', {
         work_attend_id: workAttendance[0].work_attend_id,
         time_out: timeOut
      })

      await axios.put('http://10.0.2.2:81/update/work_history', {
         emp_id: workAttendance[0].emp_id,
         job_hours: jobHours,
         absent_quantity: 0,
         late_quantity: 0,
         leave_quantity: 0
      })

      axios.post('http://10.0.2.2:81/create/payment_history', {
         wage: wage,
         sched_id: workAttendance[0].sched_id,
         emp_id: workAttendance[0].emp_id
      }).then(() => {
         console.log('post /create/payment_history already')
         setShowSuccess(true)
      })
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
                  workAttendance[0].time_out === null ? (
                     <Box alignItems={'center'}>
                        <Heading fontSize={'xl'}>ตำแหน่ง: {workSchedule.dept_name}</Heading>
                        <Text mx={2} mb={6}>พนักงาน {workSchedule.nname}</Text>
                        <Button w={'48'} h={'48'} colorScheme={'info'} borderRadius={'full'} shadow={2}
                           onPress={() => { setShowConfirm(true) }} >
                           <Heading color={'white'} fontSize={'2xl'}>บันทึกออกงาน</Heading>
                        </Button>
                     </Box>
                  ) : (<Heading alignSelf={'center'} mt={5} color={'orange.900'}>บันทึกออกงานแล้ว</Heading>)
               )
            ) : (<Heading alignSelf={'center'} mt={5} color={'orange.900'}>ไม่มี</Heading>)
         ) : (
            <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
               <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
               <Heading color="#7c2d12" fontSize="md">
                  กำลังโหลดข้อมูล
               </Heading>
            </HStack>
         )}

         <AwesomeAlert
            show={showAlert.show}
            customView={<Modal mode={'warning'} title={showAlert.text} />}
            contentContainerStyle={{ width: '80%' }}
            onDismiss={() => { setShowAlert({ show: false, text: "" }) }}
         />
         <AwesomeAlert
            show={showConfirm}
            customView={<Modal mode={'confirm'} title={'ยืนยันบันทึกออกงาน'} desc={'คุณต้องการบันทึกเวลาออกงานหรือไม่'} />}
            contentContainerStyle={{ width: '80%' }}
            showConfirmButton={true}
            confirmButtonColor={'#16a34a'}
            onConfirmPressed={() => { setShowConfirm(false); checkOut() }}
            showCancelButton={true}
            cancelButtonColor={'#a3a3a3'}
            onCancelPressed={() => { setShowConfirm(false) }}
            onDismiss={() => { setShowConfirm(false) }}
         />
         <AwesomeAlert
            show={showSuccess}
            customView={<Modal mode={'success'} title={'บันทึกออกงานสำเร็จ'} desc={`ได้รับค่าจ้างจำนวน ${wage} บาท`} />}
            contentContainerStyle={{ width: '80%' }}
            onDismiss={() => { setShowSuccess(false); setIsLoading(true) }}
         />
      </NativeBaseProvider>
   )
}

export default AttendanceEmp