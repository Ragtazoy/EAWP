import React, { useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { NativeBaseProvider, ScrollView, VStack, HStack, Box, Spinner, Text, Heading, FlatList, Button, Actionsheet, useDisclose, Pressable, Divider } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Calendar } from 'react-native-calendars'
import moment from 'moment/moment'
import AwesomeAlert from 'react-native-awesome-alerts'
import Icon from 'react-native-vector-icons/AntDesign'

import Header from '../../components/Header'
import Modal from '../../components/Modal'


const Exchange = ({ navigation }) => {
   const [workSchedule, setWorkSchedule] = useState([])
   const [workExchange, setWorkExchange] = useState([])
   const [selectedWork, setSelectedWork] = useState('')
   const [selectedDate, setSelectedDate] = useState('')

   const [isLoading, setIsLoading] = useState(true)
   const [isLoading2, setIsLoading2] = useState(false)
   const [showAlert, setShowAlert] = useState(false)
   const [showConfirm, setShowConfirm] = useState(false)
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

         await axios.get('http://10.0.2.2:81/read/a_emp_in_multi_scheduling', {
            params: { emp_id: userId, date_start: dates[1], date_end: dates[6] }
         }).then((res) => {
            setWorkSchedule(res.data)
         })
         setIsLoading(false)
      })()
   }, [isLoading])

   const selectExchangeDay = async (date) => {
      console.log(date);
      setSelectedDate(date)
      const userId = await AsyncStorage.getItem('userId');

      await axios.get('http://10.0.2.2:81/read/emp_in_scheduling', {
         params: { sched_date: date }
      }).then((res) => {
         console.log(userId);
         setWorkExchange(res.data.filter((item) => { item.dept_name === "kitchen" }))
         // setWorkExchange(res.data.filter((item) => { item.dept_name === "kitchen" && item.emp_id !== userId }))
         setIsLoading2(true)
      });

      console.log('workExchange:', workExchange)
      setIsLoading2(false)
      onOpen()
   }

   const renderItem = ({ item }) => (
      <Pressable onPress={() => { setSelectedWork(moment(item.sched_date).format('YYYY-MM-DD')) }}>
         {({ isPressed }) => {
            return <Box w={260} my={3} mr={3} p={3} borderRadius={'xl'} borderLeftWidth={4} borderColor={'blue.500'}
               bgColor={'white'} shadow={selectedWork === moment(item.sched_date).format('YYYY-MM-DD') ? 0 : 2} justifyContent={'center'}
               style={{
                  transform: [{ scale: isPressed ? 0.96 : 1 }]
               }}>
               <Text my={1} fontSize={'md'} fontWeight={'bold'} color={'blue.500'}>{moment(item.sched_date).format('dddd - D MMMM')}</Text>
               <Text fontSize={'lg'} fontWeight={'medium'}>ตำแหน่ง: {item.dept_name}</Text>
               <Text fontSize={'md'} fontWeight={'medium'}>พนักงาน: {item.nname}</Text>
               {selectedWork === moment(item.sched_date).format('YYYY-MM-DD') ? (
                  <Box pr={2} position={'absolute'} alignSelf={'flex-end'}>
                     <Icon name={'checkcircleo'} color={'#22c55e'} size={80} />
                  </Box>
               ) : null}
            </Box>;
         }}
      </Pressable>
   )

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
                     <Button w={'90%'} my={3} mr={3} p={5} bgColor={'white'} borderRadius={'xl'} shadow={1} borderLeftWidth={4} borderColor={'red.500'} justifyContent={'flex-start'} alignSelf={'center'}>
                        <Text my={1} fontSize={'md'} fontWeight={'bold'} color={'red.500'}>ไม่มีงาน</Text>
                        <Text fontSize={'lg'} fontWeight={'medium'}>ไม่พบข้อมูลตารางงานของคุณ</Text>
                     </Button>
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

            <VStack mb={10} pb={10} bgColor={'white'} borderRadius={50} shadow={1} justifyContent={'space-around'}>
               <Text pt={5} mx={10} textAlign={'center'} fontSize={'md'}>เลือกวันงานที่ต้องการแลกเปลี่ยนของพนักงานคนอื่น</Text>
               {!isLoading ? (
                  <Calendar
                     displayLoadingIndicator={false}
                     theme={{
                        monthTextColor: '#7c2d12',
                        arrowColor: '#7c2d12',
                        indicatorColor: 'red',
                        selectedDayBackgroundColor: '#7c2d12',
                     }}
                     minDate={dates[1]}
                     maxDate={dates[6]}
                     onDayPress={(date) => {
                        if (selectedWork.length === 0) {
                           setShowAlert(true)
                        } else {
                           selectExchangeDay(date.dateString)
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
                     <Heading my={2} fontSize={'xl'} alignSelf={'center'}>{moment(selectedDate).format('dddd DD MMMM YYYY')}</Heading>
                     <Text mb={4} fontSize={'md'} alignSelf={'center'}>เลือกพนักงานที่ต้องการแลกเปลี่ยนวันทำงานด้วย</Text>
                     <FlatList data={workExchange} keyExtractor={item => item.emp_id} refreshing={isLoading2}
                        renderItem={({ item }) => (
                           <Box>
                              <HStack mx={2} justifyContent={'space-between'} alignItems={'center'}>
                                 <Text fontSize={'md'}>{item.nname}</Text>
                                 <Button onPress={async () => {
                                    console.log(item.scheduling_id);
                                    // setShowConfirm(true)
                                 }} my={1} py={1.5} colorScheme={'amber'} shadow={1} borderRadius={'full'}
                                    leftIcon={<Icon name='swap' color={'white'} size={18} />}>
                                    แลกเปลี่ยน
                                 </Button>
                              </HStack>
                              <Divider my={1} />
                           </Box>
                        )}
                     />
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
      </NativeBaseProvider >
   )
}

export default Exchange