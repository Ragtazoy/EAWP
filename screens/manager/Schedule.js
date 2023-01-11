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

   const empty = { key: 'empty', color: 'gray', selectedDotColor: 'blue' };
   const filling = { key: 'filling', color: 'amber', selectedDotColor: 'blue' };
   const full = { key: 'full', color: 'green', selectedDotColor: 'blue' };

   let dates = []
   const customDate = moment().day(1)
   for (let i = 0; i < 7; i++) {
      const customDate2 = customDate.add(1, 'days').format('YYYY-MM-DD')
      dates.push(customDate2)
   }

   useEffect(() => {
      async function countEmpInScheduling() {
         await navigation.addListener('focus', () => setIsLoading(true))

         console.log('useEfff');
         console.log('setDates ' + dates);
         let count = []
         for (let i = 0; i < dates.length; i++) {
            await axios.get('http://10.0.2.2:81/read/count_emp_in_scheduling', { params: { sched_date: dates[i] } }).then((res) => {
               console.log('post /read/count_emp_in_scheduling already')
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

         {!isLoading ? (
            <ScrollView nestedScrollEnabled={true}>
               <ScrollView horizontal={true} py={5} pl={3}>
                  <FlatList horizontal={true} ItemSeparatorComponent={() => <Box p={1.5} />}
                     data={countEmp}
                     renderItem={({ item, index }) => {
                        return <LongCards mode={'mng'} txt1={'วันที่'} txt2={moment(dates[index]).format('D MMMM YYYY')} txt3={`มีพนักงาน ${item['count_emp']} คน`} />
                     }}
                     keyExtractor={item => item.uniqueProperty}
                     refreshing={isLoading} onRefresh={() => setIsLoading(true)}
                  />
               </ScrollView>
               <VStack pb={10} bgColor={'white'} borderRadius={50} shadow={1} justifyContent={'space-around'}>
                  <Text pt={5} alignSelf={'center'} fontSize={'md'}>เลือกวันงานที่ต้องการจัดตารางงาน</Text>

                  <Calendar
                     displayLoadingIndicator={false}
                     theme={{
                        monthTextColor: '#7c2d12',
                        arrowColor: '#7c2d12',
                        indicatorColor: 'red',
                        selectedDayBackgroundColor: '#b6c1cd',
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
                        let hasSchedule = false
                        switch (date.dateString) {
                           case dates[0]: countEmp[0]['count_emp'] > 0 ? hasSchedule = true : null
                           case dates[1]: countEmp[1]['count_emp'] > 0 ? hasSchedule = true : null
                           case dates[2]: countEmp[2]['count_emp'] > 0 ? hasSchedule = true : null
                           case dates[3]: countEmp[3]['count_emp'] > 0 ? hasSchedule = true : null
                           case dates[4]: countEmp[4]['count_emp'] > 0 ? hasSchedule = true : null
                           case dates[5]: countEmp[5]['count_emp'] > 0 ? hasSchedule = true : null
                           case dates[6]: countEmp[6]['count_emp'] > 0 ? hasSchedule = true : null
                        }
                        console.log(hasSchedule)
                        hasSchedule ? navigation.navigate('EditSchedule', { date: date })
                           : navigation.navigate('AddSchedule', { date: date })
                     }}
                  />

               </VStack>
            </ScrollView>
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

export default Schedule