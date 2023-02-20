import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, VStack, HStack, Heading, Text, IconButton, Box, Spinner, Popover, FlatList, Divider, Toast } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'

import Icon from 'react-native-vector-icons/FontAwesome'
import Cards from '../../components/Cards'

const AttendanceMng = ({ navigation }) => {
   const [countEmp, setCountEmp] = useState([])
   const [countAttended, setCountAttended] = useState([])
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      navigation.addListener('focus', () => setIsLoading(true))

      axios.get('http://10.0.2.2:81/read/count_emp_in_scheduling', {
         params: { sched_date: moment().format('YYYY-MM-DD') }
      }).then((res) => {
         console.log(res.data)
         setCountEmp(res.data)

         axios.get('http://10.0.2.2:81/read/work_attendance', {
            params: { sched_id: res.data.sched_id }
         }).then((res) => {
            console.log(res.data.length)
            setCountAttended(res.data.length)

            setIsLoading(false)
         })
      })
   }, [isLoading])

   const handleLogout = async () => {
      await AsyncStorage.clear()
      navigation.navigate('Login')
   }

   const renderNotification = (item) => (
      <Box flex={1}>
         <Text>awdwad</Text>
         <Divider my={1} />
      </Box>
   )

   return (
      <NativeBaseProvider>
         <HStack justifyContent={'space-around'} py={5}>

            <IconButton colorScheme={'dark'} variant={'solid'} borderRadius={'full'} shadow={1} boxSize={16} onPress={handleLogout}>
               <Icon name={'sign-out'} color={'black'} size={23} />
            </IconButton>

            <Text>ย่างเนย</Text>

            <Popover placement='left top' trigger={triggerProps => {
               return <Box>
                  <IconButton {...triggerProps} colorScheme={'dark'} variant={'solid'} borderRadius={'full'} shadow={2} boxSize={16}>
                     <Icon name={'bell-o'} color={'black'} size={20} />
                  </IconButton>
                  <Box position={'absolute'} top={0} right={0} w={4} h={4} bgColor={'error.500'} borderRadius={'full'}></Box>
               </Box>
            }}>
               <Popover.Content accessibilityLabel="notification" w="56">
                  <Popover.Arrow />
                  <Popover.CloseButton />
                  <Popover.Header>แจ้งเตือน</Popover.Header>
                  <Popover.Body>
                     <FlatList
                        data={[1, 2, 3]}
                        renderItem={renderNotification}
                        keyExtractor={item => item}
                     />
                  </Popover.Body>
               </Popover.Content>
            </Popover>

         </HStack>

         {!isLoading ? (
            <HStack space={4} p={5}>
               <Cards color={'green.400'} text={'พนักงานวันนี้'} heading={countEmp['count_emp'] + ' คน'} />
               <Cards color={'blue.300'} text={'พนักงานที่เข้างาน'} heading={countAttended + ' คน'} />
            </HStack>
         ) : (
            <HStack my={16} space={5} justifyContent="center" alignItems={'center'}>
               <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
               <Heading color="#7c2d12" fontSize="md">
                  กำลังโหลดข้อมูล
               </Heading>
            </HStack>
         )}

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
               maxDate={moment().format('YYYY-MM-DD')}
               onDayPress={date => {
                  console.log(date)
                  navigation.navigate('AttendanceDetail', { date: date })
               }}
            />
         </VStack>
      </NativeBaseProvider>
   )
}

export default AttendanceMng