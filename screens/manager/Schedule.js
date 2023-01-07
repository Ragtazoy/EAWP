import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, ScrollView, VStack, HStack, Box, Pressable, Text, Heading, Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { Calendar } from 'react-native-calendars'
import moment from 'moment/moment'
import Header from '../../components/Header'
import WeekCards from '../../components/WeekCards'
import DayCards from '../../components/DayCards'

const empty = { key: 'empty', color: 'gray', selectedDotColor: 'blue' };
const filling = { key: 'filling', color: 'amber', selectedDotColor: 'blue' };
const full = { key: 'full', color: 'green', selectedDotColor: 'blue' };

const Schedule = ({ navigation }) => {

   const dotDates = []
   // const customDate = moment().day(-1)
   // for (let i = 1; i < 5; i++) {
   //    const customDate2 = customDate.add(1, 'days').format('YYYY-MM-DD')
   //    dates.push(customDate2)
   // }

   return (
      <NativeBaseProvider>
         <Header mode={'text'} title={'จัดตารางงาน'} subtitle={'เลือกสัปดาห์ที่คุณต้องการจัดตารางงาน'} />
         <ScrollView>
            <ScrollView horizontal={true}>
               <HStack mx={3} my={5} space={2}>
                  <Pressable>
                     <WeekCards mode={'mng'} select={true} txt1={'สัปดาห์นี้'} txt2={'วันที่ 21 มีนาคม - 27 มีนาคม'} txt3={'มีพนักงาน 30 คน'} />
                  </Pressable>
                  <Pressable>
                     <WeekCards mode={'mng-add'} txt1={'เพิ่มตารางงาน'} />
                  </Pressable>
               </HStack>
            </ScrollView>

            <VStack bgColor={'white'} borderTopRadius={50} shadow={1} justifyContent={'space-around'}>
               <Text pt={5} alignSelf={'center'} fontSize={'md'}>เลือกวันงานที่ต้องการจัดตารางงาน</Text>
               {/* <ScrollView horizontal={true} mb={5}>
                  <HStack mx={3} space={3}>
                     <Pressable onPress={() => { alert('aa') }}>
                        <DayCards />
                     </Pressable>
                     <Pressable bgColor={'red.500'} p={10} onPress={() => { alert('dd') }}></Pressable>
                     <Pressable bgColor={'red.500'} p={10} onPress={() => { alert('dd') }}></Pressable>
                     <Pressable bgColor={'red.500'} p={10} onPress={() => { alert('dd') }}></Pressable>
                     <Pressable bgColor={'red.500'} p={10} onPress={() => { alert('dd') }}></Pressable>
                     <Pressable bgColor={'red.500'} p={10} onPress={() => { alert('dd') }}></Pressable>
                  </HStack>
               </ScrollView> */}
               <Calendar
                  displayLoadingIndicator={false}
                  theme={{
                     monthTextColor: '#7c2d12',
                     arrowColor: '#7c2d12',
                     indicatorColor: 'red',
                     selectedDayBackgroundColor: '#b6c1cd',
                  }}
                  minDate={new Date().toString()}
                  maxDate={moment().add(6, 'days').format('YYYY-MM-DD')}
                  markingType={'dot'}
                  markedDates={{
                     [moment().format('YYYY-MM-DD')]:                { marked: true, selectedColor: '#7c2d12', dotColor: '#d4d4d4' },
                     [moment().add(1, 'days').format('YYYY-MM-DD')]: { marked: true, dotColor: '#d4d4d4' },
                     [moment().add(2, 'days').format('YYYY-MM-DD')]: { marked: true, dotColor: '#d4d4d4' },
                     [moment().add(3, 'days').format('YYYY-MM-DD')]: { marked: true, dotColor: '#d4d4d4' },
                     [moment().add(4, 'days').format('YYYY-MM-DD')]: { marked: true, dotColor: '#d4d4d4' },
                     [moment().add(5, 'days').format('YYYY-MM-DD')]: { marked: true, dotColor: '#d4d4d4' },
                     [moment().add(6, 'days').format('YYYY-MM-DD')]: { marked: true, dotColor: '#d4d4d4' },
                  }}
                  // markedDates={
                  //    {
                  //       [dates[0]]: { startingDay: true, color: '#7c2d12', textColor: 'white' },
                  //       [dates[1]]: { color: '#7c2d12', textColor: 'white' },
                  //       [dates[2]]: { color: '#7c2d12', textColor: 'white' },
                  //       [dates[3]]: { color: '#7c2d12', textColor: 'white' },
                  //       [dates[4]]: { color: '#7c2d12', textColor: 'white' },
                  //       [dates[5]]: { color: '#7c2d12', textColor: 'white' },
                  //       [dates[6]]: { endingDay: true, color: '#7c2d12', textColor: 'white' },
                  //    }
                  // }
                  onDayPress={date => {
                     console.log('selected day', date);
                     navigation.navigate('AddSchedule', { date: date })
                  }}
               />
            </VStack>
         </ScrollView>
      </NativeBaseProvider>
   )
}

export default Schedule