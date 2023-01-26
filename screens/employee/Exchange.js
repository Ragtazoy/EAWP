import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, ScrollView, VStack, HStack, Box, Spinner, Text, Heading, FlatList, Button, Actionsheet, useDisclose } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Calendar } from 'react-native-calendars'
import moment from 'moment/moment'

import Header from '../../components/Header'
import DayCards from '../../components/DayCards'


const Exchange = ({ navigation }) => {
   const [workSchedule, setWorkSchedule] = useState([])
   const [selectedDate, setSelectedDate] = useState('')
   const [isLoading, setIsLoading] = useState(true)
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
            console.log(workSchedule);
         })

         setIsLoading(false)
      })()
   }, [isLoading])

   const renderItem = ({ item, index }) => (
      <Button w={260} my={3} mr={3} p={3} bgColor={'white'} borderRadius={'xl'} shadow={1} borderLeftWidth={4} borderColor={'blue.500'} justifyContent={'flex-start'}>
         <Text my={1} fontSize={'md'} fontWeight={'bold'} color={'blue.500'}>{moment(item.sched_date).format('dddd DD MMMM')}</Text>
         <Text fontSize={'lg'} fontWeight={'medium'}>ตำแหน่ง: {item.dept_name}</Text>
         <Text fontSize={'md'} fontWeight={'medium'}>พนักงาน: {item.nname}</Text>
      </Button>
   )

   return (
      <NativeBaseProvider>
         <Header mode={'text'} title={'แลกเปลี่ยนวันทำงาน'} subtitle={'เลือกวันงานที่ต้องการแลกเปลี่ยนของคุณ'} />

         <ScrollView nestedScrollEnabled={true}>

            <ScrollView py={2} pl={3}>
               {!isLoading ? (
                  <FlatList horizontal={true}
                     data={workSchedule}
                     renderItem={renderItem}
                     keyExtractor={item => item.scheduling_id}
                  />
               ) : (
                  <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
                     <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
                     <Heading color="#7c2d12" fontSize="md">
                        กำลังโหลดข้อมูล
                     </Heading>
                  </HStack>
               )}
            </ScrollView>

            <VStack pb={10} bgColor={'white'} borderRadius={50} shadow={1} justifyContent={'space-around'}>
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
                     minDate={dates[0]}
                     maxDate={dates[6]}
                     onDayPress={date => {
                        setSelectedDate(date.dateString)
                        onOpen()
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

            <Actionsheet isOpen={isOpen} onClose={onClose}>
               <Actionsheet.Content>
                  <Box h={'full'} bgColor={'red.300'}>
                     <Text>{selectedDate}</Text>
                  </Box>
               </Actionsheet.Content>
            </Actionsheet>

         </ScrollView>
      </NativeBaseProvider>
   )
}

export default Exchange