import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Text, Button, Heading, HStack, IconButton, Spinner, Popover, FlatList, Divider, Pressable, Actionsheet, useDisclose, VStack } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { Agenda } from 'react-native-calendars';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from '../../components/Modal';

const ScheduleEmp = ({ navigation }) => {
   const [item, setItem] = useState([])
   const [workSchedule, setWorkSchedule] = useState([])
   const [notifsExchange, setNotifsExchange] = useState([])
   const [leaveDate, setLeaveDate] = useState('')
   const [isLoading, setIsLoading] = useState(true)

   const [showConfirm, setShowConfirm] = useState(false)
   const [showSuccess, setShowSuccess] = useState({ show: false, text: '' })
   const { isOpen, onOpen, onClose } = useDisclose();

   let dates = []
   const customDate = moment()
   for (let i = 0; i < 7; i++) {
      dates.push(moment(customDate2).format('YYYY-MM-DD'))
      const customDate2 = customDate.add(1, 'days').format('YYYY-MM-DD')
   }

   useEffect(() => {
      async function empInScheduling() {
         await navigation.addListener('focus', () => setIsLoading(true))

         let empInSched = []
         const userId = await AsyncStorage.getItem('userId');

         await axios.get(process.env.SERVER + '/read/notification/exchange', {
            params: { emp_id: userId, today: moment().format('YYYY-MM-DD') }
         }).then((res) => {
            setNotifsExchange(res.data)
            console.log('notifs:', notifsExchange);
         })

         axios.get(process.env.SERVER + '/read/empdetail/' + userId).then((res) => {
            setItem(res.data)
         })

         for (let i = 0; i < dates.length; i++) {
            await axios.get(process.env.SERVER + '/read/a_emp_in_scheduling', {
               params: { emp_id: userId, sched_date: dates[i] }
            }).then((res) => {
               empInSched.push(res.data)
            })
         }

         await setWorkSchedule(empInSched)
         setIsLoading(false)
      }

      empInScheduling()
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

   const handleLogout = async () => {
      const userId = await AsyncStorage.getItem('userId');
      await axios.put(process.env.SERVER + '/update/device_token', {
         emp_id: userId,
         device_token: null
      })
      await AsyncStorage.clear()
      await navigation.navigate('Login')
   }

   const sendNotifsToManager = ({ type, date }) => {
      try {
         axios.post(process.env.SERVER + '/create/notification', {
            type: type,
            nname: type === 'leave' ? item.nname : null,
            date: type === 'leave' ? moment(date).format('YYYY-MM-DD') : null,
            scheduling_id: scheduling_id,
            exchange_scheduling_id: exchange_scheduling_id
         }).then(() => {
            console.log('post /create/notification already')
         })

         axios.get(process.env.SERVER + '/read/manager/device_token').then((res) => {
            console.log('read/manager/device_token:', res.data)

            const uniqueDevices = [...new Set(res.data.map(d => d.device_token))].map(token => ({ device_token: token }));

            uniqueDevices.forEach(token => {
               axios.post(process.env.SERVER + '/send-notification', {
                  deviceToken: token.device_token,
                  notification: {
                     title: type === 'leave' ? 'ลางานล่วงหน้า' : 'แลกเปลี่ยนวันทำงาน',
                     body: type === 'leave' ? `พนักงาน ${item.nname} ได้ลางานวันที่ ${moment(date).format('D MMMM YYYY')}`
                        : 'มีการแลกเปลี่ยนวันทำงานเกิดขึ้น',
                  },
                  data: { id: moment().format('x').toString() }
               })
            });
         })
      } catch (error) { console.log(error); }
   }

   const handleExchange = ({ exchange, work_exchange_id, scheduling_id, exchange_scheduling_id }) => {
      console.log('exchange:', exchange, 'work_exchange_id:', work_exchange_id, '', scheduling_id, 'swap', exchange_scheduling_id);

      if (exchange) {
         console.log('Exchange scheduling');
         axios.put(process.env.SERVER + '/update/exchange/scheduling', { scheduling_id: scheduling_id, exchange_scheduling_id: exchange_scheduling_id })
            .catch((err) => {
               console.log(err);
            })

         console.log('Delete work_exchange');
         axios.delete(process.env.SERVER + '/delete/a_work_exchange', { params: { work_exchange_id: work_exchange_id } })

         onClose()
         setShowSuccess({ show: true, text: 'แลกเปลี่ยนวันทำงานสำเร็จ' })
      } else {
         console.log('Delete work_exchange');
         axios.delete(process.env.SERVER + '/delete/a_work_exchange', { params: { work_exchange_id: work_exchange_id } })

         onClose()
         setShowSuccess({ show: true, text: 'ยกเลิกการแลกเปลี่ยนวันทำงานสำเร็จ' })
      }
   }

   const leaveWork = async (date) => {
      const userId = await AsyncStorage.getItem('userId');

      await axios.delete(process.env.SERVER + '/delete/a_emp_in_scheduling', { params: { id: userId, sched_date: date } })
         .then(() => {
            console.log('delete a_emp_in_scheduling already')
            sendNotifsToManager({ type: 'leave', date: date })
         }).catch((error) => {
            res.status(500).send(error);
            alert(error)
         });

      setShowConfirm(false)
      setIsLoading(true)
   }

   const renderNotification = ({ item }) => (
      <Box>
         <Pressable onPress={() => { onOpen() }}>
            {({ isPressed }) => (
               <HStack backgroundColor={isPressed ? '#f2f4f5' : 'white'} px={4} py={2} minH={'10'} space={2} alignItems={'center'}>
                  <Box w={7} pl={isPressed ? 1 : 0}>
                     <Icon name='exchange' color={'#fbbf24'} size={18} />
                  </Box>
                  <Text>คำขอแลกเปลี่ยนวันทำงาน</Text>

                  <Actionsheet isOpen={isOpen} onClose={onClose}>
                     <Actionsheet.Content>
                        <Box my={6} alignItems={'center'}>
                           <Heading mb={2} fontSize={'xl'}>ยืนยันแลกเปลี่ยนวันทำงาน</Heading>
                           <Text fontSize={'md'} textAlign={'center'}>{`พนักงาน ${item.nname} ต้องการแลกเปลี่ยนวันทำงานของคุณ\nในวันที่ ${moment(item.exchange_date).format('D MMMM YYYY')} \nกับวันที่ ${moment(item.wait_date).format('D MMMM YYYY')}`}</Text>
                        </Box>
                        <Divider />
                        <Actionsheet.Item onPress={() => {
                           handleExchange({
                              exchange: true,
                              work_exchange_id: item.work_exchange_id,
                              scheduling_id: item.scheduling_id,
                              exchange_scheduling_id: item.exchange_scheduling_id
                           })
                        }}
                           leftIcon={<Icon name='check-circle-o' color={'#16a34a'} size={26} />} alignItems={'center'}>
                           <Text fontSize={'lg'} color={'#16a34a'}>ยืนยัน</Text>
                        </Actionsheet.Item>
                        <Divider />
                        <Actionsheet.Item onPress={() => { handleExchange({ exchange: false, work_exchange_id: item.work_exchange_id }) }}
                           leftIcon={<Icon name='times-circle-o' color={'#dc2626'} size={26} />} alignItems={'center'}>
                           <Text fontSize={'lg'} color={'#dc2626'}>ปฏิเสธ</Text>
                        </Actionsheet.Item>
                        <Divider />
                        <Actionsheet.Item onPress={() => { onClose() }}
                           leftIcon={<Icon name='arrow-circle-o-left' color={'#1d1d1d'} size={26} />} alignItems={'center'}>
                           <Text fontSize={'lg'}>ยกเลิก</Text>
                        </Actionsheet.Item>
                     </Actionsheet.Content>
                  </Actionsheet>
               </HStack>
            )}
         </Pressable>

         <Divider />
      </Box>
   )

   const renderItem = (item) => (
      <Box position={'relative'} m={2} p={2} bgColor={'white'} borderRadius={'xl'} shadow={1} justifyContent={'center'} borderLeftWidth={4} borderColor={deptColor(item.dept_name)}>
         {moment().format('YYYY-MM-DD') === moment(item.sched_date).format('YYYY-MM-DD') ? (
            <Button onPress={() => { navigation.navigate('AttendanceEmp') }} position={'absolute'} top={0} right={0} p={2} colorScheme={'success'} shadow={1} borderTopRightRadius={'xl'} borderBottomLeftRadius={'xl'} borderRadius={0}
               leftIcon={<Icon name='calendar-check-o' color={'white'} size={18} />}>
               เช็คชื่อ
            </Button>
         ) : (
            <Button onPress={async () => {
               console.log(item);
               const selectedDate = await moment(item.sched_date).format('YYYY-MM-DD')
               await setLeaveDate(selectedDate)
               setShowConfirm(true)
            }}
               position={'absolute'} top={0} right={0} p={2} colorScheme={'error'} shadow={1} borderTopRightRadius={'xl'} borderBottomLeftRadius={'xl'} borderRadius={0}
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

            <IconButton onPress={handleLogout} colorScheme={'dark'} variant={'solid'} borderRadius={'full'} shadow={2} boxSize={16}>
               <Icon name={'sign-out'} color={'black'} size={23} />
            </IconButton>

            <VStack justifyContent={'center'} alignItems={'center'}>
               <Heading fontSize={'3xl'} color={'#7c2d12'}>ย่างเนย</Heading>
               <Text lineHeight={'xs'}>คลอง 6</Text>
            </VStack>

            <Popover placement='left top' trigger={triggerProps => (
               <IconButton {...triggerProps} colorScheme={'dark'} variant={'solid'} borderRadius={'full'} shadow={2} boxSize={16}>
                  <Icon name={'bell-o'} color={'black'} size={20} />
                  {notifsExchange.length > 0 ?
                     <Box position={'absolute'} top={-4} right={-4} w={3.5} h={3.5} bgColor={'error.500'} borderWidth={2} borderColor={'#d4d4d8'} borderRadius={'full'}></Box>
                     : null}
               </IconButton>
            )}>
               <Popover.Content accessibilityLabel="notification" w="64">
                  <Popover.Arrow />
                  <Popover.CloseButton />
                  <Popover.Header>แจ้งเตือน</Popover.Header>
                  <Popover.Body p={0}>
                     <FlatList
                        data={notifsExchange}
                        renderItem={renderNotification}
                        keyExtractor={item => item.work_exchange_id}
                     />
                  </Popover.Body>
               </Popover.Content>
            </Popover>

         </HStack>

         <Box flex={1} bgColor={'white'} borderTopRadius={50} shadow={1}>
            <Heading pt={5} alignSelf={'center'}>ตารางงาน</Heading>

            {!isLoading ? (
               <Agenda
                  displayLoadingIndicator={isLoading}
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
            ) : (
               <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
                  <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
                  <Heading color="#7c2d12" fontSize="md">
                     กำลังโหลดข้อมูล
                  </Heading>
               </HStack>
            )}
         </Box>

         <AwesomeAlert
            show={showConfirm}
            customView={<Modal mode={'confirm'} title={'ยืนยันลางานล่วงหน้า'} desc={'คุณต้องการลางานล่วงหน้าหรือไม่'} />}
            onDismiss={() => { setShowConfirm(false) }}
            contentContainerStyle={{ width: '80%' }}
            showConfirmButton={true}
            confirmButtonColor={'#16a34a'}
            onConfirmPressed={() => { leaveWork(leaveDate) }}
            showCancelButton={true}
            cancelButtonColor={'#a3a3a3'}
            onCancelPressed={() => { setShowConfirm(false) }}
         />
         <AwesomeAlert
            show={showSuccess.show}
            customView={<Modal mode={'success'} title={showSuccess.text} />}
            contentContainerStyle={{ width: '80%' }}
            onDismiss={() => { setShowSuccess({ show: false }); setIsLoading(true) }}
         />

      </NativeBaseProvider>
   )
}

export default ScheduleEmp