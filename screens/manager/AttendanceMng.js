import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, VStack, HStack, Heading, Text, IconButton } from 'native-base'
import axios from 'axios'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'
import Cards from '../../components/Cards'

const AttendanceMng = ({ navigation }) => {
   const [countEmp, setCountEmp] = useState([])
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      axios.get('http://10.0.2.2:81/read/count_emp_in_scheduling', { params: { sched_date: moment().format('YYYY-MM-DD') } }).then((res) => {
         console.log(res.data)
         setCountEmp(res.data)
         setIsLoading(false)
      })

   }, [isLoading])


   return (
      <NativeBaseProvider>
         <HStack justifyContent={'space-around'} py={5}>
            <IconButton colorScheme={'dark'} variant={'solid'} borderRadius={'full'} shadow={1} boxSize={16} onPress={() => navigation.navigate('Login')}>
               <Icon name={'sign-out'} color={'black'} size={23} />
            </IconButton>
            <Text>ย่างเนย</Text>
            <IconButton colorScheme={'dark'} variant={'solid'} borderRadius={'full'} shadow={1} boxSize={16} onPress={() => navigation.goBack()}>
               <Icon name={'bell-o'} color={'black'} size={20} />
            </IconButton>
         </HStack>

         <HStack space={4} p={5}>
            <Cards color={'green.400'} text={'พนักงานวันนี้'} heading={countEmp['count_emp'] + ' คน'} />
            <Cards color={'blue.300'} text={'พนักงานที่เข้างาน'} heading={'-' + ' คน'} />
         </HStack>

         <VStack pb={10} bgColor={'white'} borderRadius={50} shadow={1} justifyContent={'space-around'}>
            <Heading pt={5} alignSelf={'center'}>การเข้างาน</Heading>
            <Calendar
               displayLoadingIndicator={false}
               theme={{
                  monthTextColor: '#7c2d12',
                  arrowColor: '#7c2d12',
                  indicatorColor: 'red',
                  selectedDayBackgroundColor: '#7c2d12',
               }}
               initialDate={moment().format('YYYY-MM-DD')}
               onDayPress={date => {
                  console.log(date)
                  navigation.navigate('AttendanceDetail', { date: date })
                  // hasSchedule ? navigation.navigate('EditSchedule', { date: date })
                  //    : navigation.navigate('AddSchedule', { date: date })
               }}
            />
         </VStack>
      </NativeBaseProvider>
   )
}

export default AttendanceMng