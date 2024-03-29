import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Text, VStack, Heading, ScrollView, IconButton, HStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Feather'
import AwesomeAlert from 'react-native-awesome-alerts'
import Header from '../../components/Header'
import Modal from '../../components/Modal'

const ProfileMng = ({ route }) => {
   const navigation = useNavigation()
   const [item, setitem] = useState({})
   const [isLoading, setIsLoading] = useState(true)
   const [showConfirm, setShowConfirm] = useState(false)
   const [showAlert, setShowAlert] = useState(false)

   useEffect(() => {
      navigation.addListener('focus', () => setIsLoading(true))

      console.log('id: ' + route.params.id);
      axios.get(process.env.SERVER + '/read/empdetail/' + route.params.id).then((res) => {
         setitem(res.data)
         setIsLoading(false)
         console.log(item);
      })
   }, [isLoading])

   const deleteEmployee = () => {
      console.log('del id:' + route.params.id)
      axios.delete(process.env.SERVER + '/delete/emp/' + route.params.id).catch(error => {
         console.log(error)
      })
   };

   const handleSubmit = () => {
      deleteEmployee()
      setShowAlert(true)
   };

   const propHeader = () => {
      return (
         <VStack space={2}>
            <IconButton colorScheme='dark' variant={'outline'} boxSize={16} borderRadius={'full'} onPress={() => navigation.navigate('EditEmp', { id: item.emp_id })}>
               <Icon name="edit" size={20} color="black" />
            </IconButton>
            <IconButton colorScheme='danger' variant={'solid'} boxSize={16} borderRadius={'full'} onPress={() => { setShowConfirm(true) }}>
               <Icon name="user-x" size={20} color="white" />
            </IconButton>
         </VStack>
      )
   };

   
   return (
      <NativeBaseProvider>
         <Header icon={'faUser'} color={'blue.500'} title={item.nname} subtitle={item.fname + ' ' + item.lname} element={propHeader()} />

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

               <AwesomeAlert
                  show={showConfirm}
                  customView={<Modal mode={'confirm'} title={'ยืนยันลบข้อมูลพนักงาน'} desc={'คุณต้องการลบลบข้อมูลพนักงานคนนี้หรือไม่'} />}
                  onDismiss={() => { setShowConfirm(false) }}
                  contentContainerStyle={{ width: '80%' }}
                  showConfirmButton={true}
                  confirmButtonColor={'#16a34a'}
                  onConfirmPressed={handleSubmit}
                  showCancelButton={true}
                  cancelButtonColor={'#a3a3a3'}
                  onCancelPressed={() => { setShowConfirm(false) }}
               />
               <AwesomeAlert
                  show={showAlert}
                  customView={<Modal mode={'success'} title={'ลบข้อมูลสำเร็จ'} />}
                  contentContainerStyle={{ width: '80%' }}
                  onDismiss={() => { navigation.navigate('Emp') }}
               />

            </VStack>
         </ScrollView >
      </NativeBaseProvider >
   )
}

export default ProfileMng