import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, ScrollView, VStack, HStack, Box, Spinner, Text, Heading, Flex, Divider, FlatList, Button } from 'native-base'
import axios from 'axios'
import moment from 'moment/moment'
import Header from '../../components/Header'

const ReportAttend = ({ navigation }) => {
   const [items, setItems] = useState([])
   const [selected, setSelected] = useState('absent_quantity')
   const [isLoading, setIsLoading] = useState(true)

   let dates = []
   const customDate = moment()
   for (let i = 0; i < 7; i++) {
      dates.push(moment(customDate2).format('YYYY-MM-DD'))
      const customDate2 = customDate.add(1, 'days').format('YYYY-MM-DD')
   }

   useEffect(() => {
      async function getWorkHistory() {
         await axios.get('http://10.0.2.2:81/read/work_history').then((res) => {
            setItems(res.data)
         })
         setIsLoading(false)
      }

      getWorkHistory()
   }, [isLoading])

   const hasSelected = (report) => {
      setSelected(report)
      items.sort(function (a, b) {
         return b[report] - a[report];
      })
   }

   const changeTitle = () => {
      switch (selected) {
         case 'absent_quantity':
            return 'สถิติการขาดงาน'
         case 'late_quantity':
            return 'สถิติการลางาน'
         case 'leave_quantity':
            return 'สถิติการมาสาย'
      }
   }

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
               <Text alignSelf={'center'}>{item[selected]}</Text>
            </Box>
         </Flex>
      </Box>
   )

   return (
      <NativeBaseProvider>
         <Header icon={'faCalendarXmark'} color={'orange.400'} title={'รายงานการ\nขาด/ลา/มาสาย'} element={<Box boxSize={16}></Box>} />

         <HStack m={5} p={2} bgColor={'white'} borderRadius={'full'} justifyContent={'space-evenly'}>
            <Button onPress={() => { hasSelected('absent_quantity') }} flex={0.33} variant={selected === 'absent_quantity' ? 'solid' : 'outline'} colorScheme={'amber'} borderLeftRadius={'full'}>
               ขาด</Button>
            <Button onPress={() => { hasSelected('late_quantity') }} flex={0.33} variant={selected === 'late_quantity' ? 'solid' : 'outline'} colorScheme={'amber'}>
               ลา</Button>
            <Button onPress={() => { hasSelected('leave_quantity') }} flex={0.33} variant={selected === 'leave_quantity' ? 'solid' : 'outline'} colorScheme={'amber'} borderRightRadius={'full'}>
               มาสาย</Button>
         </HStack>

         <VStack flex={1} bgColor={'white'} borderTopRadius={50} shadow={1} justifyContent={'space-around'}>
            <Heading pt={5} pb={2} alignSelf={'center'} fontSize={'lg'}>{changeTitle()}</Heading>

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
                  <Text alignSelf={'center'} color={'white'}>จำนวนครั้ง</Text>
               </Box>
            </HStack>

            <FlatList
               data={items} renderItem={renderItem} keyExtractor={item => item.emp_id}
               refreshing={isLoading} onRefresh={() => setIsLoading(true)} />

         </VStack>

      </NativeBaseProvider >
   )
}

export default ReportAttend