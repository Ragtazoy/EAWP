import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, ScrollView, VStack, HStack, Box, Spinner, Text, Heading, FlatList, Flex } from 'native-base'
import axios from 'axios'
import { Calendar } from 'react-native-calendars'
import moment from 'moment/moment'
import Header from '../../components/Header'
import LongCards from '../../components/LongCards'
import DayCards from '../../components/DayCards'


const Schedule = ({ navigation }) => {
   const [countEmp, setCountEmp] = useState([])
   const [isLoading, setIsLoading] = useState(true)

   let dates = []
   const customDate = moment()
   for (let i = 0; i < 7; i++) {
      dates.push(moment(customDate2).format('YYYY-MM-DD'))
      const customDate2 = customDate.add(1, 'days').format('YYYY-MM-DD')
   }

   useEffect(() => {
      async function countEmpInScheduling() {
         await navigation.addListener('focus', () => setIsLoading(true))

         console.log('useEfff');
         console.log('setDates ' + dates);
         let count = []
         for (let i = 0; i < dates.length; i++) {
            await axios.get('http://10.0.2.2:81/read/count_emp_in_scheduling', { params: { sched_date: dates[i] } }).then((res) => {
               console.log(typeof dates[i], dates[i], res.data)
               count.push(res.data)
            })
         }
         const combineProps = await count.map((item, index) => ({
            ...item, count_emp: count[index],
            ...item, date: dates[index]
         }))
         setCountEmp(combineProps)
         console.log('countEmp ' + JSON.stringify(combineProps));

         setIsLoading(false)
      }

      countEmpInScheduling()
   }, [isLoading])



   return (
      <NativeBaseProvider>
         <Header mode={'text'} title={'จัดตารางงาน'} subtitle={'จำนวนพนักงานในแต่ละวัน'} />

         <ScrollView nestedScrollEnabled={true}>

            <ScrollView py={5} pl={3}>
               <FlatList horizontal={true} ItemSeparatorComponent={() => <Box p={1.5} />}
                  data={countEmp}
                  renderItem={({ item, index }) => {
                     return <LongCards mode={'mng'} txt1={'วันที่'} txt2={moment(dates[index]).format('D MMMM YYYY')} txt3={`มีพนักงาน ${item['count_emp']} คน`} />
                  }}
                  keyExtractor={item => item.date}
               />
            </ScrollView>

            <VStack pb={10} bgColor={'white'} borderRadius={50} shadow={1} justifyContent={'space-around'}>
               <Text pt={5} alignSelf={'center'} fontSize={'md'}>เลือกวันงานที่ต้องการจัดตารางงาน</Text>
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
                     markingType={'dot'}
                     markedDates={{
                        [dates[0]]: { marked: true, selectedColor: '#7c2d12', dotColor: countEmp[0]['count_emp'] > 0 ? '#16a34a' : '#d4d4d4' },
                        [dates[1]]: { marked: true, dotColor: countEmp[1]['count_emp'] > 0 ? '#16a34a' : '#d4d4d4' },
                        [dates[2]]: { marked: true, dotColor: countEmp[2]['count_emp'] > 0 ? '#16a34a' : '#d4d4d4' },
                        [dates[3]]: { marked: true, dotColor: countEmp[3]['count_emp'] > 0 ? '#16a34a' : '#d4d4d4' },
                        [dates[4]]: { marked: true, dotColor: countEmp[4]['count_emp'] > 0 ? '#16a34a' : '#d4d4d4' },
                        [dates[5]]: { marked: true, dotColor: countEmp[5]['count_emp'] > 0 ? '#16a34a' : '#d4d4d4' },
                        [dates[6]]: { marked: true, dotColor: countEmp[6]['count_emp'] > 0 ? '#16a34a' : '#d4d4d4' },
                     }}
                     onDayPress={date => {
                        let hasSchedule
                        switch (date.dateString) {
                           case dates[0]: countEmp[0]['count_emp'] > 0 ? hasSchedule = true : hasSchedule = false; break;
                           case dates[1]: countEmp[1]['count_emp'] > 0 ? hasSchedule = true : hasSchedule = false; break;
                           case dates[2]: countEmp[2]['count_emp'] > 0 ? hasSchedule = true : hasSchedule = false; break;
                           case dates[3]: countEmp[3]['count_emp'] > 0 ? hasSchedule = true : hasSchedule = false; break;
                           case dates[4]: countEmp[4]['count_emp'] > 0 ? hasSchedule = true : hasSchedule = false; break;
                           case dates[5]: countEmp[5]['count_emp'] > 0 ? hasSchedule = true : hasSchedule = false; break;
                           case dates[6]: countEmp[6]['count_emp'] > 0 ? hasSchedule = true : hasSchedule = false; break;
                        }
                        console.log(countEmp[5]['count_emp'] > 0)
                        console.log(hasSchedule)
                        hasSchedule ? navigation.navigate('EditSchedule', { date: date })
                           : navigation.navigate('AddSchedule', { date: date })
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

         </ScrollView>
      </NativeBaseProvider>
   )
}

export default Schedule