import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Heading, ScrollView, Spinner, HStack, VStack, FlatList, Text, Divider } from 'native-base'
import axios from 'axios'
import moment from 'moment'

import Header from '../../components/Header'
import Badges from '../../components/Badges'

const AttendanceDetail = ({ route }) => {
   const { date } = route.params
   const [emp, setEmp] = useState([])
   const groupedData = {};
   const deptThai = ['แคชเชียร์', 'ครัว', 'ล้างจาน', 'เตา', 'หน้าร้าน']

   const [isLoading, setIsLoading] = useState(true)


   useEffect(() => {
      const getData = async () => {

         console.log('useEffect');

         await axios.get('http://10.0.2.2:81/read/emp_in_scheduling', {
            params: { sched_date: moment(date.dateString).format('YYYY-MM-DD') }
         }).then(async (res) => {
            const empDept = res.data
            console.log('emp1', empDept);

            if (empDept.length === 0) {
               setIsLoading(false);
            } else {
               await axios.get('http://10.0.2.2:81/read/work_attendance', {
                  params: { sched_id: empDept[0].sched_id }
               }).then(async (res) => {
                  const empStatus = res.data
                  console.log('emp2', empStatus);

                  empDept.forEach((empDept) => {
                     if (empStatus.some(empStatus => empDept.emp_id === empStatus.emp_id)) {
                        empDept.status = "attended";
                     } else {
                        empDept.status = "";
                     }
                  })
               })

               await empDept.forEach(entry => {
                  const deptName = entry.dept_name;
                  if (!groupedData[deptName]) {
                     groupedData[deptName] = [];
                  }
                  groupedData[deptName].push(entry);
               })
               await setEmp(groupedData);
               console.log('groupedData', groupedData);

               setIsLoading(false);
            }
         })

      }

      getData()
   }, [isLoading])

   const propHeader = () => {
      return (
         <Box boxSize={16}></Box>
      )
   };

   const renderItem = ({ item }) => (
      <Box>
         <HStack mx={2} justifyContent={'space-between'} alignItems={'center'}>
            <Text fontSize={'md'}>{item.nname}</Text>
            <Badges status={item.status} />
         </HStack>
         <Divider my={1} />
      </Box>
   )

   return (
      <NativeBaseProvider>
         <Header icon={'faCalendarCheck'} color={'blue.400'} title={'การเข้างาน'} element={propHeader()} />

         {!isLoading ? (
            <VStack flex={1} mt={5} px={5} bgColor={'white'} borderTopRadius={50} shadow={1}>
               <Text pt={5} alignSelf={'center'} fontSize={'lg'}>{moment(date.dateString).format('dddd DD MMMM YYYY')}</Text>
               <ScrollView>
               {['cashier', 'kitchen', 'wash', 'stove', 'waiter'].map((dept, index) => {
                  return (
                     <Box pt={5} bgColor={'white'}>
                        <Heading>{deptThai[index]}</Heading>
                        <FlatList data={emp[dept]} renderItem={renderItem} keyExtractor={item => item.scheduling_id} />
                        <Divider my={5} pb={1} borderRadius={'full'} bgColor={'#7c2d12'} />
                     </Box>
                  )
               })}
               </ScrollView>
            </VStack>
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

export default AttendanceDetail



// useEffect(() => {
//    const getData = async () => {
//       console.log('useEffect');

//       await axios.get('http://10.0.2.2:81/read/emp_in_scheduling', {
//          params: { sched_date: moment(date.dateString).format('YYYY-MM-DD') }
//       }).then(async (res) => {
//          console.log(res.data);
//          await setEmp(res.data);
//          console.log('emp1', emp);

//          await axios.get('http://10.0.2.2:81/read/work_attendance', {
//             params: { sched_id: res.data[0].sched_id }
//          }).then(async (res) => {
//             console.log(res.data);
//             await setWorkAttendance(res.data);
//             console.log('emp2', emp);

//          })

//          setIsLoading(false);
//       }

//    getData()

// }, [isLoading])