import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, VStack, HStack, Heading, Text, IconButton, Box, Spinner, Popover, Pressable, FlatList, Divider, Actionsheet, useDisclose } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'

import Icon from 'react-native-vector-icons/FontAwesome'
import Cards from '../../components/Cards'

const AttendanceMng = ({ navigation }) => {
   const [notifsExchange, setNotifsExchange] = useState([])
   const [countAttended, setCountAttended] = useState([])
   const [countEmp, setCountEmp] = useState([])

   const [isLoading, setIsLoading] = useState(true)
   const { isOpen, onOpen, onClose } = useDisclose();

   useEffect(() => {
      navigation.addListener('focus', () => setIsLoading(true))

      axios.get('http://10.0.2.2:81/read/notification/admin').then((res) => {
         setNotifsExchange(res.data)
         console.log(res.data);
      })

      axios.get('http://10.0.2.2:81/read/count_emp_in_scheduling', {
         params: { sched_date: moment().format('YYYY-MM-DD') }
      }).then((res) => {
         setCountEmp(res.data)

         axios.get('http://10.0.2.2:81/read/work_attendance', {
            params: { sched_id: res.data.sched_id }
         }).then((res) => {
            setCountAttended(res.data.length)

            setIsLoading(false)
         })
      })
   }, [isLoading])

   const handleLogout = async () => {
      await AsyncStorage.clear()
      navigation.navigate('Login')
   }

   const renderNotification = ({ item }) => (
      <Box>
         <Pressable onPress={() => { onOpen() }}>
            {({ isPressed }) => (
               <HStack backgroundColor={isPressed ? '#f2f4f5' : 'white'} px={4} py={2} minH={'10'} space={2} alignItems={'center'}>
                  <Box w={7} pl={isPressed ? 1 : 0}>
                     <Icon name='calendar-minus-o' color={'#dc2626'} size={18} />
                  </Box>
                  <Text>ลางานล่วงหน้า</Text>

                  <Actionsheet isOpen={isOpen} onClose={onClose}>
                     <Actionsheet.Content>
                        <Box my={6} alignItems={'center'}>
                           <Heading mb={2} fontSize={'xl'}>ลางานล่วงหน้า</Heading>
                           <Text fontSize={'md'} textAlign={'center'}>{`พนักงาน ${item.nname} ได้ลางานวันที่ ${moment(item.date).format('D MMMM YYYY')}`}</Text>
                        </Box>
                        <Divider />
                        <Actionsheet.Item onPress={() => {
                           console.log('Delete notification');
                           axios.delete('http://10.0.2.2:81/delete/a_notification', { params: { notification_id: item.notification_id } })
                           onClose()
                           setIsLoading(true)
                        }}
                           leftIcon={<Icon name='trash-o' color={'#dc2626'} size={26} />} alignItems={'center'}>
                           <Text fontSize={'lg'} color={'#dc2626'}>ลบ</Text>
                        </Actionsheet.Item>
                     </Actionsheet.Content>
                  </Actionsheet>
               </HStack>
            )}
         </Pressable>

         <Divider />
      </Box>
   )

   return (
      <NativeBaseProvider>
         <HStack justifyContent={'space-around'} py={5}>

            <IconButton colorScheme={'dark'} variant={'solid'} borderRadius={'full'} shadow={1} boxSize={16} onPress={handleLogout}>
               <Icon name={'sign-out'} color={'black'} size={23} />
            </IconButton>

            <Text>ย่างเนย</Text>

            <Popover placement='left top' trigger={triggerProps => (
               <IconButton {...triggerProps} colorScheme={'dark'} variant={'solid'} borderRadius={'full'} shadow={2} boxSize={16}>
                  <Icon name={'bell-o'} color={'black'} size={20} />
                  {notifsExchange.length > 0 ?
                     <Box position={'absolute'} top={-4} right={-4} w={3.5} h={3.5} bgColor={'error.500'} borderWidth={2} borderColor={'#d4d4d8'} borderRadius={'full'}></Box>
                     : null}
               </IconButton>
            )}>
               <Popover.Content accessibilityLabel="notification" w="56">
                  <Popover.Arrow />
                  <Popover.CloseButton />
                  <Popover.Header>แจ้งเตือน</Popover.Header>
                  <Popover.Body p={0}>
                     <FlatList
                        data={notifsExchange}
                        renderItem={renderNotification}
                        keyExtractor={item => item.notification_id}
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