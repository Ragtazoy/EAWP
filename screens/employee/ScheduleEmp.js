import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Text, Button, Heading, HStack, IconButton } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { Agenda } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome'

const ScheduleEmp = ({ navigation }) => {
   const [workSchedule, setWorkSchedule] = useState([])

   const [isLoading, setIsLoading] = useState(true)

   let dates = []
   const customDate = moment()
   for (let i = 0; i < 7; i++) {
      dates.push(moment(customDate2).format('YYYY-MM-DD'))
      const customDate2 = customDate.add(1, 'days').format('YYYY-MM-DD')
   }

   useEffect(() => {
      async function empInScheduling() {
         let empInSched = []
         const userId = await AsyncStorage.getItem('userId');
         console.log('id: ' + userId);

         for (let i = 0; i < dates.length; i++) {
            await axios.get('http://10.0.2.2:81/read/a_emp_in_scheduling', {
               params: { emp_id: userId, sched_date: dates[i] }
            }).then((res) => {
               empInSched.push(res.data)
            })
         }

         setWorkSchedule(empInSched)
         console.log(empInSched);
      }

      empInScheduling()
      setIsLoading(false)
   }, [isLoading])


   const deptColor = (dept) => {
      switch (dept) {
         case 'cashier': return 'purple.500';
         case 'kitchen': return 'lime.500';
         case 'wash': return 'lightBlue.500';
         case 'stove': return 'orange.500';
         case 'waiter': return 'amber.500';
      }
   }

   const renderItem = (item) => (
      <Box position={'relative'} m={2} p={2} bgColor={'white'} borderRadius={'xl'} shadow={1} justifyContent={'center'} borderLeftWidth={4} borderColor={deptColor(item.dept_name)}>
         {moment().diff(item.sched_date, 'days') === 0 ? (
            <Button onPress={() => { navigation.navigate('AttendanceEmp') }} position={'absolute'} top={0} right={0} p={2} colorScheme={'success'} shadow={1} borderTopRightRadius={'xl'} borderBottomLeftRadius={'xl'} borderRadius={0}
               leftIcon={<Icon name='calendar-check-o' color={'white'} size={18} />}>
               เช็คชื่อ
            </Button>
         ) : (
            <Button onPress={() => { leaveWork() }} position={'absolute'} top={0} right={0} p={2} colorScheme={'error'} shadow={1} borderTopRightRadius={'xl'} borderBottomLeftRadius={'xl'} borderRadius={0}
               leftIcon={<Icon name='calendar-times-o' color={'white'} size={18} />}>
               ลางาน
            </Button>
         )}

         <Text my={1} fontSize={'md'} fontWeight={'bold'} color={deptColor(item.dept_name)}>16:00 น.</Text>
         <Text fontSize={'lg'} fontWeight={'medium'}>ตำแหน่ง: {item.dept_name}</Text>
         <Text fontSize={'md'} fontWeight={'medium'}>พนักงาน: {item.nname}</Text>
      </Box>
   )

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
         <Box flex={1} bgColor={'white'} borderTopRadius={50} shadow={1}>
            <Heading pt={5} alignSelf={'center'}>ตารางงาน</Heading>
            <Agenda
               selected={dates[0]}
               minDate={dates[0]}
               maxDate={dates[6]}
               items={{
                  [dates[0]]: [workSchedule[0]],
                  [dates[1]]: [workSchedule[1]],
                  [dates[2]]: [workSchedule[2]],
                  [dates[3]]: [workSchedule[3]],
                  [dates[4]]: [workSchedule[4]],
                  [dates[5]]: [workSchedule[5]],
                  [dates[6]]: [workSchedule[6]],
               }}
               theme={{
                  dotColor: '#7c2d12',
                  selectedDayBackgroundColor: '#7c2d12',
                  agendaTodayColor: '#7c2d12',
               }}
               hideKnob={true}
               renderItem={renderItem}
               refreshing={isLoading} onRefresh={() => setIsLoading(true)}
            />
         </Box>

      </NativeBaseProvider>
   )
}

export default ScheduleEmp