import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Text, Button, Heading, HStack, IconButton, Spinner, Popover, Avatar, Badge, Fab, Pressable, FlatList, Divider } from 'native-base'
import messaging from '@react-native-firebase/messaging';
import { notificationListener } from '../../screens/Notification'
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
   const [isLoading, setIsLoading] = useState(true)
   const [showConfirm, setShowConfirm] = useState(false)
   const [leaveDate, setLeaveDate] = useState('')

   notificationListener()

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

         axios.get('http://10.0.2.2:81/read/empdetail/' + userId).then((res) => {
            setItem(res.data)
         })

         for (let i = 0; i < dates.length; i++) {
            await axios.get('http://10.0.2.2:81/read/a_emp_in_scheduling', {
               params: { emp_id: userId, sched_date: dates[i] }
            }).then((res) => {
               empInSched.push(res.data)
            })
         }

         await setWorkSchedule(empInSched)
         console.log(empInSched);
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

   const handleFCM = async () => {
      await axios.post('http://10.0.2.2:81/send-notification', {
         deviceToken: 'dYMkxp6ISBCtknAZy84qom:APA91bHIPdXflIciAIzX58Mgiqts8fIS2nQkgtDLJNyBMznwJ9rXXunZVrzO9JWhXHGCC3LWnnjucbdLpAEFmmVoxadHf_q6FYsafTAWccFrQElFEtqvM7pDPdTiz3M486u17EK32QEa',
         notification: {
            title: 'ลางานล่วงหน้า',
            body: `พนักงาน ${item.nname} ได้ลางาน`,
         },
         data: {
            id: moment().format('x').toString()
         }
      })
   }

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

   const leaveWork = async (date) => {
      console.log(`พนักงาน ${item.nname} ได้ลางานวันที่ ${moment(date).format('DD MMMM YYYY')}`);
      console.log(workSchedule);
      // setIsLoading(true)
      // const userId = await AsyncStorage.getItem('userId');
      // await axios.delete('http://10.0.2.2:81/delete/a_emp_in_scheduling', {
      //    params: { id: userId, sched_date: date }
      // }).then(() => {
      //    console.log('deleted a_emp_in_scheduling');
      //    setShowConfirm(false)
      // })
   }

   const renderItem = (item) => (
      <Box position={'relative'} m={2} p={2} bgColor={'white'} borderRadius={'xl'} shadow={1} justifyContent={'center'} borderLeftWidth={4} borderColor={deptColor(item.dept_name)}>
         {moment().format('YYYY-MM-DD') === moment(item.sched_date).format('YYYY-MM-DD') ? (
            <Button onPress={() => { navigation.navigate('AttendanceEmp') }} position={'absolute'} top={0} right={0} p={2} colorScheme={'success'} shadow={1} borderTopRightRadius={'xl'} borderBottomLeftRadius={'xl'} borderRadius={0}
               leftIcon={<Icon name='calendar-check-o' color={'white'} size={18} />}>
               เช็คชื่อ
            </Button>
         ) : (
            <Button onPress={async () => {
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

            <Text onPress={handleFCM}>ย่างเนย</Text>

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

      </NativeBaseProvider>
   )
}

export default ScheduleEmp