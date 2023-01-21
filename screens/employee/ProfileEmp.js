import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Text, VStack, Heading, ScrollView, IconButton, HStack } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../../components/Header'

const ProfileEmp = ({ navigation }) => {
   const [item, setitem] = useState({})
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      const getEmpDetail = async () => {
         const emp_id = await AsyncStorage.getItem('userId');
         console.log('id: ' + emp_id);
         await axios.get('http://10.0.2.2:81/read/empdetail/' + emp_id).then((res) => {
            setitem(res.data)
            console.log(item);
         })
         await setIsLoading(false)
      }

      getEmpDetail()
   }, [isLoading])


   const propHeader = () => {
      return (
         <IconButton colorScheme='dark' variant={'outline'} boxSize={16} borderRadius={'full'} onPress={() => navigation.navigate('EditEmp', { id: item.emp_id })}>
            <Icon name="edit" size={20} color="black" />
         </IconButton>
      )
   };

   return (
      <NativeBaseProvider>
         <Header icon={'faUser'} color={'blue.500'} title={item.nname} subtitle={item.fname + ' ' + item.lname} element={propHeader()} />
         <ScrollView>
            <VStack space={5} p={5}>

               <Box mt={2}>
                  <Heading mb={2}>ประวัติการเข้างาน</Heading>
                  <HStack space={2}>
                     <Box flex={0.33} bgColor={'green.200'} p={3} borderRadius={25} >
                        <Text mb={4} fontSize={'sm'} color='green.800'>ชั่วโมงทำงานทั้งหมด</Text>
                        <Heading fontSize={'lg'} color='green.800'>{item.job_hours} ชม.</Heading>
                     </Box>
                     <Box flex={0.33} bgColor={'amber.200'} p={3} borderRadius={25} >
                        <Text mb={4} fontSize={'sm'} color='amber.800'>จำนวนการมาสาย</Text>
                        <Heading fontSize={'lg'} color='amber.800'>{item.absent_quantity} ครั้ง</Heading>
                     </Box>
                     <Box flex={0.33} bgColor={'red.200'} p={3} borderRadius={25} >
                        <Text mb={4} fontSize={'sm'} color='red.800'>จำนวนการขาดงาน</Text>
                        <Heading fontSize={'lg'} color='red.800'>{item.leave_quantity} ครั้ง</Heading>
                     </Box>
                  </HStack>
               </Box>

               <Box bgColor={'white'} p={5} borderRadius={25} shadow={3}>
                  <Heading mb={2}>ข้อมูลพนักงาน</Heading>
                  <HStack>
                     <Text flex={0.3} mr={1} color={'gray.500'}>ตำแหน่ง :</Text>
                     <Text flex={0.7}>{item.job_title}</Text>
                  </HStack>
                  <HStack>
                     <Text flex={0.3} mr={1} color={'gray.500'}>แผนกงาน :</Text>
                     <Text flex={0.7}>{item.dept}</Text>
                  </HStack>
                  <HStack>
                     <Text flex={0.3} mr={1} color={'gray.500'}>วันเข้าทำงาน :</Text>
                     <Text flex={0.7}>{moment(item.job_start).format('D MMMM yyyy')}</Text>
                  </HStack>
               </Box>

               <Box bgColor={'white'} p={5} borderRadius={25} shadow={3}>
                  <Heading mb={2}>ข้อมูลส่วนตัว</Heading>
                  <HStack>
                     <Text flex={0.3} mr={1} color={'gray.500'}>วันเกิด :</Text>
                     <Text flex={0.7}>{moment(item.birthdate).format('D MMMM yyyy')}</Text>
                  </HStack>
                  <HStack>
                     <Text flex={0.3} mr={1} color={'gray.500'}>เบอร์โทรศัพท์ :</Text>
                     <Text flex={0.7}>{item.phone}</Text>
                  </HStack>
                  <HStack>
                     <Text flex={0.3} mr={1} color={'gray.500'}>บัญชีไลน์ :</Text>
                     <Text flex={0.7}>{item.line_account}</Text>
                  </HStack>
               </Box>

            </VStack>
         </ScrollView>
      </NativeBaseProvider>
   )
}

export default ProfileEmp