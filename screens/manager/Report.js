import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, ScrollView, Text, VStack, HStack, Pressable, Spinner, Heading } from 'native-base'
import axios from 'axios';
import moment from 'moment';
import { LineChart, PieChart } from 'react-native-chart-kit';

import Header from '../../components/Header'

const Report = ({ navigation }) => {
   const [data, setData] = useState({})
   const [data2, setData2] = useState({})
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      (async () => {
         await navigation.addListener('focus', () => setIsLoading(true))
         let dates = []
         let sumWage = []

         const customDate = moment()
         for (let i = 0; i < 6; i++) {
            await dates.unshift(moment(customDate2).format('MMM'))
            const customDate2 = await customDate.subtract(1, 'months')
         }

         for (let i = 0; i < dates.length; i++) {
            console.log(moment(dates[i], "MMM").startOf('month').format('YYYY-MM-DD'));
            console.log(moment(dates[i], "MMM").endOf('month').format('YYYY-MM-DD'),'\n=====');
            await axios.get('http://10.0.2.2:81/read/sum_wage', {
               params: {
                  date_from: moment(dates[i], "MMM").startOf('month').format('YYYY-MM-DD'),
                  date_to: moment(dates[i], "MMM").endOf('month').format('YYYY-MM-DD'),
               }
            }).then((res) => {
               res.data.sum_wage === null ? sumWage.push(0) : sumWage.push(parseInt(res.data.sum_wage))
            })
         }
         await setData({
            labels: dates,
            datasets: [{ data: sumWage }]
         })

         await axios.get('http://10.0.2.2:81/read/sum_work_history').then((res) => {
            setData2([
               {
                  name: "ขาดงาน",
                  datasets: parseInt(res.data.sum_absent),
                  color: "#ea580c",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
               },
               {
                  name: "มาสาย",
                  datasets: parseInt(res.data.sum_late),
                  color: "#fb923c",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
               },
               {
                  name: "ลางาน",
                  datasets: parseInt(res.data.sum_leave),
                  color: "#fed7aa",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
               }
            ])
         })

         setIsLoading(false)
      })()
   }, [isLoading])

   const chartConfig = {
      backgroundGradientFrom: 'white',
      backgroundGradientTo: 'white',
      fillShadowGradientFromOpacity: 0.5,
      fillShadowGradientToOpacity: 0,
      color: (opacity = 1) => `rgba(10, 211, 238, ${opacity})`,
      strokeWidth: 2
   };

   return (
      <NativeBaseProvider>
         <Header mode={'text'} title={'รายงาน'} subtitle={'ประวัติการจ่ายค่าจ้างและการขาด/ลา/มาสาย'} />
         <VStack flex={1} py={5} alignItems={'center'} space={5}>

            <Pressable flex={0.5} w={360} onPress={() => { navigation.navigate('ReportWage') }}>
               {({ isPressed }) => {
                  return <Box flex={1} bg={isPressed ? "muted.100" : "white"} shadow={3}
                     style={{ borderRadius: 25, transform: [{ scale: isPressed ? 0.96 : 1 }] }}>
                     <Text my={2} ml={4} fontWeight="medium" fontSize="lg">รายงานการจ่ายค่าจ้าง</Text>
                     {!isLoading ? (
                        <LineChart
                           data={data} width={360} height={200} chartConfig={chartConfig} bezier
                        />
                     ) : (
                        <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
                           <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
                           <Heading color="#7c2d12" fontSize="md">
                              กำลังโหลดข้อมูล
                           </Heading>
                        </HStack>
                     )}
                  </Box>;
               }}
            </Pressable>

            <Pressable flex={0.5} w={360} onPress={() => { navigation.navigate('ReportAttend') }}>
               {({ isPressed }) => {
                  return <Box flex={1} bg={isPressed ? "muted.100" : "white"} shadow={3}
                     style={{ borderRadius: 25, transform: [{ scale: isPressed ? 0.96 : 1 }] }}>
                     <Text my={2} ml={4} fontWeight="medium" fontSize="lg">รายงานการขาด/ลา/มาสาย</Text>
                     {!isLoading ? (
                        <PieChart
                           data={data2} width={320} height={220} chartConfig={chartConfig}
                           accessor={"datasets"}
                           backgroundColor={"transparent"}
                           paddingLeft={"30"}
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
                  </Box>;
               }}
            </Pressable>

         </VStack>
      </NativeBaseProvider>
   )
}

export default Report