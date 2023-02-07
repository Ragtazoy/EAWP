import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Flex, Text, VStack, HStack, Spinner, Heading, Divider, FlatList } from 'native-base'
import axios from 'axios';
import moment from 'moment';
import { PieChart } from 'react-native-chart-kit';

import Header from '../../components/Header'

const Evaluate = ({ navigation }) => {
   const [items, setItems] = useState([])
   const [data2, setData2] = useState({})
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      (async () => {
         await navigation.addListener('focus', () => setIsLoading(true))

         await axios.get('http://10.0.2.2:81/read/emplist').then((res) => {
            setItems(res.data)
         })

         await axios.get('http://10.0.2.2:81/read/sum_work_history').then((res) => {
            setData2([
               {
                  name: "ประเมินแล้ว",
                  datasets: parseInt(res.data.sum_absent),
                  color: "#ea580c",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
               },
               {
                  name: "ยังไม่ประเมิน",
                  datasets: parseInt(res.data.sum_late),
                  color: "#fb923c",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
               }
            ])
         })

         setIsLoading(false)
      })()
   }, [isLoading])

   const chartConfig = {
      color: (opacity = 1) => `rgba(10, 211, 238, ${opacity})`
   };

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
            {/* <Box flex={0.25}>
               <Text alignSelf={'center'}>{item[selected]}</Text>
            </Box> */}
         </Flex>
      </Box>
   )

   return (
      <NativeBaseProvider>
         <Header mode={'text'} title={'ประเมินพนักงาน'} subtitle={'ประเมินพนักงานรายเดือน'} />
         {!isLoading ? (
            <PieChart
               data={data2} width={320} height={180} chartConfig={chartConfig}
               accessor={"datasets"}
               backgroundColor={"transparent"}
               paddingLeft={"15"}
               style={{ alignSelf: 'center' }}
               absolute
            />
         ) : (
            <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
               <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
               <Heading color="#7c2d12" fontSize="md">
                  กำลังโหลดข้อมูล
               </Heading>
            </HStack>
         )}


         <VStack flex={1} bgColor={'white'} borderTopRadius={50} shadow={1} justifyContent={'space-around'}>
            <Heading pt={5} pb={2} alignSelf={'center'} fontSize={'lg'}>awd</Heading>

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
                  <Text alignSelf={'center'} color={'white'}>คะแนน</Text>
               </Box>
            </HStack>

            <FlatList
               data={items} renderItem={renderItem} keyExtractor={item => item.emp_id}
               refreshing={isLoading} onRefresh={() => setIsLoading(true)} />
         </VStack>

      </NativeBaseProvider>
   )
}

export default Evaluate