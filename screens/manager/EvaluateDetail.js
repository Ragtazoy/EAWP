import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Text, VStack, HStack, Heading, Spinner, ScrollView } from 'native-base'
import axios from 'axios';
import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';
import StarRating from 'react-native-star-rating';

import Header from '../../components/Header'

const EvaluateDetail = ({ route }) => {
   const [item, setItem] = useState([])
   const [data, setData] = useState({ labels: '', datasets: '' })
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      (async () => {
         axios.get('http://10.0.2.2:81/read/empdetail/' + route.params.id).then((res) => {
            setItem(res.data)
         })

         let dates = []
         let score = []
         const customDate = moment()
         for (let i = 0; i < 6; i++) {
            await dates.unshift(moment(customDate2).format('MMM'))
            const customDate2 = await customDate.subtract(1, 'M')
         }
         console.log('date:', dates);

         for (let i = 0; i < dates.length; i++) {
            console.log('month:', moment(dates[i], "MMM").startOf('month').format('YYYY-MM-DD'));
            await axios.get('http://10.0.2.2:81/read/a_evaluate', {
               params: {
                  emp_id: route.params.id,
                  date_from: moment(dates[i], "MMM").startOf('month').format('YYYY-MM-DD'),
                  date_to: moment(dates[i], "MMM").endOf('month').format('YYYY-MM-DD'),
               }
            }).then((res) => {
               res.data.score == null ? score.push(0) : score.push(parseInt(res.data.score))
            })
         }

         await setData({
            labels: dates,
            datasets: [{ data: score }]
         })
         console.log(data.datasets[0]);

         setIsLoading(false)
      })()
   }, [])

   const chartConfig = {
      backgroundGradientFrom: 'white',
      backgroundGradientTo: 'white',
      fillShadowGradientFromOpacity: 0.5,
      fillShadowGradientToOpacity: 0,
      color: (opacity = 1) => `rgba(124, 45, 18, ${opacity})`,
      strokeWidth: 2
   };

   return (
      <NativeBaseProvider>
         <Header icon={'faStar'} color={'amber.300'} title={item.nname} subtitle={item.fname + ' ' + item.lname} element={<Box boxSize={16}></Box>} />

         <ScrollView>
            <Box mt={6}>
               <Heading ml={4} mb={4}>ประวัติการเข้างาน</Heading>
               <ScrollView horizontal={true}>
                  <HStack mx={4} space={2}>
                     <Box w={'120'} bgColor={'green.200'} p={3} borderRadius={25} >
                        <Text mb={4} fontSize={'sm'} color='green.700'>ชั่วโมงทำงานทั้งหมด</Text>
                        <Heading fontSize={'lg'} color='green.700'>{item.job_hours} ชม.</Heading>
                     </Box>
                     <Box w={'120'} bgColor={'info.200'} p={3} borderRadius={25} >
                        <Text mb={4} fontSize={'sm'} color='info.600'>จำนวนการลางาน</Text>
                        <Heading fontSize={'lg'} color='info.600'>{item.leave_quantity} ครั้ง</Heading>
                     </Box>
                     <Box w={'120'} bgColor={'amber.200'} p={3} borderRadius={25} >
                        <Text mb={4} fontSize={'sm'} color='amber.700'>จำนวนการมาสาย</Text>
                        <Heading fontSize={'lg'} color='amber.700'>{item.late_quantity} ครั้ง</Heading>
                     </Box>
                     <Box w={'120'} bgColor={'red.200'} p={3} borderRadius={25} >
                        <Text mb={4} fontSize={'sm'} color='red.700'>จำนวนการขาดงาน</Text>
                        <Heading fontSize={'lg'} color='red.700'>{item.absent_quantity} ครั้ง</Heading>
                     </Box>
                  </HStack>
               </ScrollView>
            </Box>

            <VStack space={5} p={5}>
               <Box bgColor={'white'} p={5} borderRadius={25} shadow={3}>
                  <Heading mb={3}>คะแนนเดือนที่แล้ว</Heading>
                  {!isLoading && data.datasets !== '' ? (
                     <HStack mx={2} justifyContent={'space-between'} alignItems={'center'}>
                        <Heading mr={5} color={'amber.300'} fontSize={'3xl'}>{data.datasets[0].data[4]}</Heading>
                        <Box flex={1}>
                           <StarRating
                              disabled={true}
                              emptyStar={'star-o'} fullStar={'star'} halfStar={'star-half-o'}
                              iconSet={'FontAwesome'}
                              maxStars={5}
                              rating={data.datasets[0].data[4]}
                              fullStarColor={'#fcd34d'}
                              emptyStarColor={'#fcd34d'}
                           />
                        </Box>
                     </HStack>
                  ) : (
                     <HStack my={2} space={2} justifyContent="center" alignItems={'center'}>
                        <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
                        <Heading color="#7c2d12" fontSize="md">
                           กำลังโหลดข้อมูล
                        </Heading>
                     </HStack>
                  )}
               </Box>

               <Box bgColor={'white'} py={5} borderRadius={25} shadow={3}>
                  <Heading px={5} mb={3}>ประวัติคะแนนการประเมิน</Heading>
                  {!isLoading && data.datasets !== '' ? (
                     <LineChart
                        data={data} width={350} height={230} chartConfig={chartConfig} bezier
                     />
                  ) : (
                     <HStack my={10} space={2} justifyContent="center" alignItems={'center'}>
                        <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
                        <Heading color="#7c2d12" fontSize="md">
                           กำลังโหลดข้อมูล
                        </Heading>
                     </HStack>
                  )}
               </Box>
            </VStack>
         </ScrollView>
      </NativeBaseProvider>
   )
}

export default EvaluateDetail