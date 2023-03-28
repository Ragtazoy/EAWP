import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, ScrollView, VStack, HStack, Box, Spinner, Text, Heading, FlatList, Button, Actionsheet, useDisclose, Pressable, Divider } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Calendar } from 'react-native-calendars'
import moment from 'moment/moment'
import AwesomeAlert from 'react-native-awesome-alerts'
import Icon from 'react-native-vector-icons/AntDesign'
import Icon2 from 'react-native-vector-icons/Ionicons'

import Header from '../../components/Header'
import Modal from '../../components/Modal'


const Exchange = ({ navigation }) => {
   const [workSchedule, setWorkSchedule] = useState([])
   const [chkWorkExchange, setChkWorkExchange] = useState(false)
   const [chkDate, setChkDate] = useState([false, false, false, false, false, false])
   const [mySchedId, setMySchedId] = useState([])
   const [workExchange, setWorkExchange] = useState([])
   const [selectedWork, setSelectedWork] = useState({ date: [], dept: [] })
   const [selectedDate, setSelectedDate] = useState('')
   const [selectedWorkExchange, setSelectedWorkExchange] = useState({ waitDate: '', myScheduling: 0, exScheduling: 0, nname: '' })

   const [isLoading, setIsLoading] = useState(true)
   const [isLoading2, setIsLoading2] = useState(false)
   const [showAlert, setShowAlert] = useState(false)
   const [showConfirm, setShowConfirm] = useState(false)
   const [showSuccess, setShowSuccess] = useState(false)
   const { isOpen, onOpen, onClose } = useDisclose()

   let dates = []
   const customDate = moment()
   for (let i = 0; i < 7; i++) {
      dates.push(moment(customDate2).format('YYYY-MM-DD'))
      const customDate2 = customDate.add(1, 'days').format('YYYY-MM-DD')
   }

   useEffect(() => {
      (async () => {
         await navigation.addListener('focus', () => setIsLoading(true))
         const userId = await AsyncStorage.getItem('userId');

         await axios.get(process.env.SERVER + '/read/a_emp_in_multi_scheduling', {
            params: { emp_id: userId, date_start: dates[1], date_end: dates[6] }
         }).then((res) => {
            setWorkSchedule(res.data)
         })

         setIsLoading(false)
      })()
   }, [isLoading])

   useEffect(() => {
      if (isLoading2) {
         (async () => {
            let otherSelectedWork
            setIsLoading2(true)

            const userId = await AsyncStorage.getItem('userId');

            await axios.get(process.env.SERVER + '/read/emp_in_scheduling', {
               params: { sched_date: selectedWork.date }
            }).then((res) => {
               otherSelectedWork = res.data.filter((item) => item.dept_name !== selectedWork.dept)
               otherSelectedWork = otherSelectedWork.map(item => item.emp_id);
            });

            await axios.get(process.env.SERVER + '/read/emp_in_scheduling', {
               params: { sched_date: selectedDate }
            }).then((res) => {
               let filteredWorkExchange

               if (!res.data.map(item => item.emp_id).includes(parseInt(userId))) {
                  filteredWorkExchange = res.data
                     .filter((i) => i.dept_name === selectedWork.dept)
                     .filter((i) => !otherSelectedWork.includes(i.emp_id))
               }

               setWorkExchange(filteredWorkExchange)
            });

            console.log('workExchange:', workExchange)
            setIsLoading2(false)
         })()
      }
   }, [isLoading2])


   const handleSelectedWork = async (selectDate, selectDept, scheduling_id) => {
      console.log('handleSelectedWork:', selectDate, selectDept, scheduling_id);
      setChkWorkExchange(true)
      setMySchedId(scheduling_id)
      setSelectedWork({ date: selectDate, dept: selectDept })

      let otherSelectedWork
      let hasExchange = []
      const userId = await AsyncStorage.getItem('userId');

      await axios.get(process.env.SERVER + '/read/emp_in_scheduling', {
         params: { sched_date: selectDate }
      }).then((res) => {
         otherSelectedWork = res.data.filter((item) => item.dept_name !== selectDept)
         otherSelectedWork = otherSelectedWork.map(item => item.emp_id);
      });

      // check work in each day emp_id != userId and same dept with selectDept and emp that is exchange not in selectDate
      for (let i = 1; i < dates.length; i++) {
         await axios.get(process.env.SERVER + '/read/emp_in_scheduling', {
            params: { sched_date: dates[i] }
         }).then((res) => {
            if (!res.data.map(item => item.emp_id).includes(parseInt(userId))) {
               hasExchange.push(
                  res.data.filter((i) => i.dept_name === selectDept)
                     .filter((i) => !otherSelectedWork.includes(i.emp_id))
               )
            } else {
               hasExchange.push([])
            }
         })
      }
      const result = hasExchange.map(date => {
         return date.length > 0 ? true : false
      });
      setChkDate(result)
      console.log(chkDate);
      setChkWorkExchange(false)
   }

   const handleExchange = async () => {

      console.log('selectedWorkExchange:', selectedWorkExchange);

      axios.post(process.env.SERVER + '/create/work_exchange', {
         wait_date: selectedWorkExchange.waitDate,
         scheduling_id: selectedWorkExchange.myScheduling,
         exchange_scheduling_id: selectedWorkExchange.exScheduling
      }).then(() => {
         console.log('post /create/work_exchange already')
      })

      axios.get(process.env.SERVER + '/read/exchange/device_token', {
         params: { scheduling_id: selectedWorkExchange.exScheduling }
      }).then((res) => {
         console.log('read/exchange/device_token:', res.data.device_token)

         axios.post(process.env.SERVER + '/send-notification', {
            deviceToken: res.data.device_token,
            notification: {
               title: 'ขอแลกเปลี่ยนวันทำงาน',
               body: `พนักงาน ${selectedWorkExchange.nname} ได้ลางาน`,
            },
            data: { id: moment().format('x').toString() }
         })
      })

      setSelectedWork({ date: [], dept: [] })
      setChkDate([false, false, false, false, false, false])
      await onClose()
      setIsLoading(true)
      setIsLoading2(true)
      await setShowSuccess(true)
      await setShowConfirm(false)

   }

   const renderItem = ({ item }) => {
      if (item.work_exchange_id !== null) {
         return <Box w={260} my={3} mr={3} p={3} borderRadius={'xl'} borderLeftWidth={4} borderColor={'#fcd34d'}
            bgColor={'white'} shadow={0} justifyContent={'center'}>
            <Text my={1} fontSize={'md'} fontWeight={'bold'} color={'#fcd34d'}>{moment(item.sched_date).format('dddd - D MMMM')}</Text>
            <Text fontSize={'lg'} fontWeight={'medium'}>ตำแหน่ง: {item.dept_name}</Text>
            <Text fontSize={'md'} fontWeight={'medium'}>พนักงาน: {item.nname}</Text>

            <Box pr={2} position={'absolute'} alignSelf={'flex-end'}>
               <Icon2 name={'ios-timer-outline'} color={'#fcd34d'} size={90} />
            </Box>

         </Box>
      } else {
         return <Pressable onPress={() => {
            handleSelectedWork(moment(item.sched_date).format('YYYY-MM-DD'), item.dept_name, item.scheduling_id)
         }}>
            {({ isPressed }) => {
               return selectedWork.date === moment(item.sched_date).format('YYYY-MM-DD') ? (
                  <Box w={260} my={3} mr={3} p={3} borderRadius={'xl'} borderLeftWidth={4} borderColor={'#22c55e'}
                     bgColor={'white'} shadow={0} justifyContent={'center'}
                     style={{
                        transform: [{ scale: isPressed ? 0.96 : 1 }]
                     }}>
                     <Text my={1} fontSize={'md'} fontWeight={'bold'} color={'#22c55e'}>{moment(item.sched_date).format('dddd - D MMMM')}</Text>
                     <Text fontSize={'lg'} fontWeight={'medium'}>ตำแหน่ง: {item.dept_name}</Text>
                     <Text fontSize={'md'} fontWeight={'medium'}>พนักงาน: {item.nname}</Text>

                     <Box pr={4} position={'absolute'} alignSelf={'flex-end'}>
                        <Icon name={'checkcircleo'} color={'#22c55e'} size={75} />
                     </Box>

                  </Box>
               ) : (
                  <Box w={260} my={3} mr={3} p={3} borderRadius={'xl'} borderLeftWidth={4} borderColor={'#7c2d12'}
                     bgColor={'white'} shadow={2} justifyContent={'center'}
                     style={{
                        transform: [{ scale: isPressed ? 0.96 : 1 }]
                     }}>
                     <Text my={1} fontSize={'md'} fontWeight={'bold'} color={'#7c2d12'}>{moment(item.sched_date).format('dddd - D MMMM')}</Text>
                     <Text fontSize={'lg'} fontWeight={'medium'}>ตำแหน่ง: {item.dept_name}</Text>
                     <Text fontSize={'md'} fontWeight={'medium'}>พนักงาน: {item.nname}</Text>
                  </Box>
               )
            }}
         </Pressable>
      }
   }


   return (
      <NativeBaseProvider>
         <Header mode={'text'} title={'แลกเปลี่ยนวันทำงาน'} subtitle={'เลือกวันงานที่ต้องการแลกเปลี่ยนของคุณ'} />

         <ScrollView nestedScrollEnabled={true}>

            <ScrollView py={2} pl={3}>
               {!isLoading ? (
                  workSchedule.length !== 0 ? (
                     <FlatList horizontal={true}
                        data={workSchedule}
                        renderItem={renderItem}
                        keyExtractor={item => item.scheduling_id}
                     />
                  ) : (
                     <Box w={'90%'} my={3} mr={3} p={5} bgColor={'white'} borderRadius={'xl'} shadow={1} borderLeftWidth={4} borderColor={'red.500'} justifyContent={'flex-start'} alignSelf={'center'}>
                        <Text my={1} fontSize={'md'} fontWeight={'bold'} color={'red.500'}>ไม่มีงาน</Text>
                        <Text fontSize={'lg'} fontWeight={'medium'}>ไม่มีตารางงานที่สามารถแลกเปลี่ยนได้</Text>
                     </Box>
                  )
               ) : (
                  <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
                     <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
                     <Heading color="#7c2d12" fontSize="md">
                        กำลังโหลดข้อมูล
                     </Heading>
                  </HStack>
               )}
            </ScrollView>

            <VStack mb={4} pb={10} bgColor={'white'} borderRadius={50} shadow={1} justifyContent={'space-around'}>
               <Text pt={5} mx={10} textAlign={'center'} fontSize={'md'}>เลือกวันงานที่ต้องการแลกเปลี่ยนของพนักงานคนอื่น</Text>
               {!isLoading ? (
                  <Calendar
                     displayLoadingIndicator={chkWorkExchange}
                     theme={{
                        monthTextColor: '#7c2d12',
                        arrowColor: '#7c2d12',
                        indicatorColor: '#7c2d12',
                        selectedDayBackgroundColor: '#7c2d12',
                     }}
                     minDate={dates[1]}
                     maxDate={dates[6]}
                     markingType={'dot'}
                     markedDates={{
                        [dates[1]]: { marked: chkDate[0], dotColor: '#16a34a' },
                        [dates[2]]: { marked: chkDate[1], dotColor: '#16a34a' },
                        [dates[3]]: { marked: chkDate[2], dotColor: '#16a34a' },
                        [dates[4]]: { marked: chkDate[3], dotColor: '#16a34a' },
                        [dates[5]]: { marked: chkDate[4], dotColor: '#16a34a' },
                        [dates[6]]: { marked: chkDate[5], dotColor: '#16a34a' },
                     }}
                     onDayPress={(date) => {
                        if (selectedWork.date.length === 0) {
                           setShowAlert(true)
                        } else {
                           setSelectedDate(date.dateString)
                           onOpen()
                           setIsLoading2(true)
                        }
                     }}
                  />
               ) : (
                  <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
                     <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
                     <Heading color="#7c2d12" fontSize="md">
                        กำลังโหลดข้อมูล
                     </Heading>
                  </HStack>
               )}
            </VStack>

            <Actionsheet Actionsheet isOpen={isOpen} onClose={onClose} >
               <Actionsheet.Content>
                  <Box w={'full'} maxH={'full'} >
                     <Heading my={2} fontSize={'xl'} alignSelf={'center'}>{moment(selectedDate).format('dddd D MMMM YYYY')}</Heading>
                     <Text mb={4} fontSize={'md'} alignSelf={'center'}>เลือกพนักงานที่ต้องการแลกเปลี่ยนวันทำงานด้วย</Text>
                     {!isLoading2 ? (
                        <FlatList data={workExchange} keyExtractor={item => item.emp_id} refreshing={isLoading2}
                           renderItem={({ item }) => (
                              <Box>
                                 <HStack mx={2} justifyContent={'space-between'} alignItems={'center'}>
                                    <Text fontSize={'md'}>{item.nname}</Text>
                                    <Button onPress={() => {
                                       setSelectedWorkExchange({
                                          waitDate: selectedWork.date,
                                          myScheduling: mySchedId,
                                          exScheduling: item.scheduling_id,
                                          nname: item.nname
                                       })
                                       setShowConfirm(true)
                                    }} my={1} py={1.5} colorScheme={'amber'} shadow={1} borderRadius={'full'}
                                       leftIcon={<Icon name='swap' color={'white'} size={18} />}>
                                       แลกเปลี่ยน
                                    </Button>
                                 </HStack>
                                 <Divider my={1} />
                              </Box>
                           )}
                        />
                     ) : (
                        <HStack my={4} space={2} justifyContent="center" alignItems={'center'}>
                           <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
                           <Heading color="#7c2d12" fontSize="md">
                              กำลังโหลดข้อมูล
                           </Heading>
                        </HStack>
                     )}
                  </Box>

               </Actionsheet.Content>
            </Actionsheet >

         </ScrollView>

         <AwesomeAlert
            show={showAlert}
            customView={<Modal mode={'warning'} title={'ต้องเลือกวันทำงานของคุณก่อน'} />}
            contentContainerStyle={{ width: '80%' }}
            onDismiss={() => { setShowAlert(false) }}
         />
         <AwesomeAlert
            show={showConfirm}
            customView={<Modal mode={'confirm'} title={'ยืนยันแลกเปลี่ยนวันทำงาน'} desc={'ต้องการแลกเปลี่ยนวันงานของคุณในวันที่ ' + moment(selectedWorkExchange.waitDate).format('D MMMM') + ' ใช่หรือไม่'} />}
            onDismiss={() => { setShowConfirm(false) }}
            contentContainerStyle={{ width: '80%' }}
            showConfirmButton={true}
            confirmButtonColor={'#16a34a'}
            onConfirmPressed={handleExchange}
            showCancelButton={true}
            cancelButtonColor={'#a3a3a3'}
            onCancelPressed={() => { setShowConfirm(false) }}
         />
         <AwesomeAlert
            show={showSuccess}
            customView={<Modal mode={'waiting'} title={'ส่งคำขอแลกเปลี่ยนวันทำงานสำเร็จ'} desc={'รอการยืนยันจากพนักงานที่ทำการแลกเปลี่ยนวันทำงานด้วย'} />}
            contentContainerStyle={{ width: '80%' }}
            onDismiss={() => { setShowSuccess(false) }}
         />

      </NativeBaseProvider >
   )
}

export default Exchange