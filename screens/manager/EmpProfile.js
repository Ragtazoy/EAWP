import React, { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import { NativeBaseProvider, Box, Text, VStack, FormControl, Input, Heading, Select, CheckIcon, Checkbox, ScrollView, Button, IconButton, Toast } from 'native-base'
import axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker'
import AwesomeAlert from 'react-native-awesome-alerts'
import { useNavigation } from '@react-navigation/native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSave, faEdit } from '@fortawesome/free-regular-svg-icons'
import Header from '../../components/Header'
import Modal from '../../components/Modal'

const EmpProfile = () => {
   const navigation = useNavigation()
   const [showAlert, setShowAlert] = useState(false)

   const addEmployee = () => {
      if (validate()) {

      }
   };

   const handleDelete = () => {
      if (validate()) {
         console.log('Submitted')
         addEmployee()
         setShowAlert(true)
      } else console.log('Invalid')
   };

   const propHeader = () => {
      return (
         <VStack>
            <IconButton colorScheme='primary' variant={'solid'} borderRadius={'full'} boxSize={16} onPress={() => navigation.navigate('EditEmp')}>
               <FontAwesomeIcon icon={faEdit} color={'white'} size={22} />
            </IconButton>
            <IconButton colorScheme='primary' variant={'solid'} borderRadius={'full'} boxSize={16} onPress={handleDelete}>
               <FontAwesomeIcon icon={faSave} color={'white'} size={22} />
            </IconButton>
         </VStack>
      )
   };

   return (
      <NativeBaseProvider>
         <Header icon={'faUserPlus'} color={'lime.500'} title={'เพิ่มข้อมูลพนักงาน'} element={propHeader()} />
         <ScrollView>
            <VStack space={5} m={5}>

               <Box bgColor={'white'} p={5} borderRadius={25} shadow={3}>
                  <Heading alignSelf={'center'}>ข้อมูลบัญชี</Heading>
               </Box>

               <AwesomeAlert
                  show={showAlert}
                  customView={<Modal mode={'success'} title={'เพิ่มข้อมูลสำเร็จ'} />}
                  onDismiss={() => { navigation.navigate('Employee') }}
                  contentContainerStyle={{ width: '80%' }}
               />

            </VStack>
         </ScrollView>
      </NativeBaseProvider>
   )
}

export default EmpProfile