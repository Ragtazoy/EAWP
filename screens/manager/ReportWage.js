import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, ScrollView, VStack, HStack, Box, Spinner, Text, Heading, Flex, Divider, FlatList, Button, Actionsheet, useDisclose } from 'native-base'
import axios from 'axios'
import { Calendar } from 'react-native-calendars'
import moment from 'moment/moment'
import Header from '../../components/Header'


const ReportWage = ({ navigation }) => {
   const [items, setItems] = useState(true)
   const [wage, setWage] = useState(0)
   const [selectedDate, setSelectedDate] = useState(moment())
   const [isLoading, setIsLoading] = useState(true)
   const { isOpen, onOpen, onClose } = useDisclose();

   let dates = []
   const customDate = moment()
   for (let i = 0; i < 7; i++) {
      dates.push(moment(customDate2).format('YYYY-MM-DD'))
      const customDate2 = customDate.add(1, 'days').format('YYYY-MM-DD')
   }

   useEffect(() => {
      let totalWage = 0;

      async function getEmplist() {
         await axios.get('http://10.0.2.2:81/read/payment_history', {
            params: { sched_date: moment(selectedDate).format('YYYY-MM-DD') }
         }).then((res) => {
            setItems(res.data)
            for (let i = 0; i < res.data.length; i++) {
               totalWage += res.data[i].wage;
            }
            setWage(totalWage)
         })

         setIsLoading(false)
      }

      getEmplist()
   }, [isLoading])

   const renderItem = ({ item }) => (
      <Box>
         <Divider />
         <Flex my={2} direction="row" alignItems={'center'}>
            <Box flex={0.25}>
               <Text alignSelf={'center'}>{item.nname}</Text>
            </Box>
            <Box flex={0.25}>
               <Text alignSelf={'center'}>{item.job_title}</Text>
            </Box>
            <Box flex={0.25}>
               <Text alignSelf={'center'}>{item.dept}</Text>
            </Box>
            <Box flex={0.25}>
               <Text alignSelf={'center'}>{item.wage}</Text>
            </Box>
         </Flex>
      </Box>
   )

   return (
      <NativeBaseProvider>
         <Header icon={'faCoins'} color={'amber.400'} title={'รายงานค่าจ้าง'} element={<Box boxSize={16}></Box>} />

         <Button onPress={onOpen} my={3} width={160} height={160} alignSelf={'center'} colorScheme={'dark'} shadow={2} borderRadius={'full'}>
            {!isLoading ? (
               <>
                  <Heading alignSelf={'center'} fontSize={'4xl'} color={'amber.500'}>{wage}</Heading>
                  <Text alignSelf={'center'}>ค่าจ้างพนักงานทั้งหมด</Text>
               </>
            ) : (
               <Spinner accessibilityLabel="Loading" size={40} color={'#7c2d12'} />
            )}
         </Button>


         <VStack pb={20} bgColor={'white'} borderTopRadius={50} shadow={1} justifyContent={'space-around'}>
            <Text pt={5} alignSelf={'center'} fontSize={'md'}>เลือกวันที่ต้องการดูรายงานค่าจ้าง</Text>

            <Calendar
               theme={{
                  monthTextColor: '#7c2d12',
                  arrowColor: '#7c2d12',
                  indicatorColor: 'red',
                  selectedDayBackgroundColor: '#7c2d12',
               }}
               initialDate={moment(selectedDate).format('YYYY-MM-DD')}
               maxDate={moment().format('YYYY-MM-DD')}
               onDayPress={date => { setSelectedDate(date.dateString); setIsLoading(true) }}
            />

         </VStack>

         <Actionsheet isOpen={isOpen} onClose={onClose} disableOverlay={'true'} shadow={1}>
            <Actionsheet.Content px={0}>
               <Box h={'96'} w={'full'}>

                  <HStack bgColor={'#7c2d12'} h={10} py={1} alignItems={'center'}>
                     <Box flex={0.25}>
                        <Text alignSelf={'center'} color={'white'}>ชื่อ</Text>
                     </Box>
                     <Divider orientation="vertical" mx="1" />
                     <Box flex={0.25}>
                        <Text alignSelf={'center'} color={'white'}>ตำแหน่ง</Text>
                     </Box>
                     <Divider orientation="vertical" mx="1" />
                     <Box flex={0.25}>
                        <Text alignSelf={'center'} color={'white'}>แผนก</Text>
                     </Box>
                     <Divider orientation="vertical" mx="1" />
                     <Box flex={0.25}>
                        <Text alignSelf={'center'} color={'white'}>ค่าจ้าง</Text>
                     </Box>
                  </HStack>

                  <FlatList
                     data={items} renderItem={renderItem} keyExtractor={item => item.emp_id}
                     refreshing={isLoading} onRefresh={() => setIsLoading(true)} />

               </Box>

            </Actionsheet.Content>
         </Actionsheet>


      </NativeBaseProvider >
   )
}

export default ReportWage