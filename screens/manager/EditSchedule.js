import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Heading, IconButton, ScrollView, Spinner, HStack, VStack } from 'native-base'
import axios from 'axios'
import moment from 'moment'
import MultiSelect from 'react-native-multiple-select'
import AwesomeAlert from 'react-native-awesome-alerts'
import Icon from 'react-native-vector-icons/FontAwesome'
import Header from '../../components/Header'
import Modal from '../../components/Modal'

import { LogBox, SafeAreaView } from 'react-native'
LogBox.ignoreLogs(['VirtualizedLists should never be nested'])

const EditSchedule = ({ route, navigation }) => {
   const { date } = route.params
   const [workSchedule, setWorkSchedule] = useState([])
   const groupedData = {};

   const [cashier, setCashier] = useState([])
   const [kitchen, setKitchen] = useState([])
   const [wash, setWash] = useState([])
   const [stove, setStove] = useState([])
   const [waiter, setWaiter] = useState([])
   const [selectedCashier, setSelectedCashier] = useState([])
   const [selectedKitchen, setSelectedKitchen] = useState([])
   const [selectedWash, setSelectedWash] = useState([])
   const [selectedStove, setSelectedStove] = useState([])
   const [selectedWaiter, setSelectedWaiter] = useState([])

   const [showAlert, setShowAlert] = useState(false)
   const [showAlert2, setShowAlert2] = useState(false)
   const [showInvalid, setShowInvalid] = useState(false)
   const [showInvalid2, setShowInvalid2] = useState(false)
   const [showConfirm, setShowConfirm] = useState(false)
   const [isLoading, setIsLoading] = useState(true)


   useEffect(() => {
      const getEmpInSchedule = async () => {
         axios.get('http://10.0.2.2:81/read/work_schedule', {
            params: { sched_date: moment(date.dateString).format('YYYY-MM-DD') }
         }).then((res) => {
            setWorkSchedule(res.data)
            console.log(workSchedule);
         })

         axios.get('http://10.0.2.2:81/read/emp_in_scheduling', {
            params: { sched_date: moment(date.dateString).format('YYYY-MM-DD') }
         }).then((res) => {
            res.data.forEach(entry => {
               const deptName = entry.dept_name;
               if (!groupedData[deptName]) {
                  groupedData[deptName] = [];
               }
               groupedData[deptName].push(entry.emp_id);
            });
            console.log(groupedData);
            setSelectedCashier(groupedData['cashier'])
            setSelectedKitchen(groupedData['kitchen'])
            setSelectedWash(groupedData['wash'])
            setSelectedStove(groupedData['stove'])
            setSelectedWaiter(groupedData['waiter'])
         })

         await axios.get('http://10.0.2.2:81/read/empdept').then((res) => {

            ['cashier', 'kitchen', 'wash', 'stove', 'waiter'].forEach((dept) => {
               const empInDept = res.data.filter(item => item.dept_name === dept)
               console.log('dept: ' + dept + ' - item: ' + JSON.stringify(empInDept));
               switch (dept) {
                  case 'cashier': setCashier(empInDept)
                  case 'kitchen': setKitchen(empInDept)
                  case 'wash': setWash(empInDept)
                  case 'stove': setStove(empInDept)
                  case 'waiter': setWaiter(empInDept)
               }
            })

         })

         setIsLoading(false)
      };

      getEmpInSchedule()
   }, [isLoading])


   const editScheduling = async () => {
      await axios.delete('http://10.0.2.2:81/delete/emp_in_scheduling', {
         params: { sched_date: moment(date.dateString).format('YYYY-MM-DD') }
      }).catch(error => {
         console.log(error)
      })
      selectedCashier.map((val) => {
         axios.post('http://10.0.2.2:81/create/scheduling', { sched_id: work_schedule['sched_id'], emp_id: val, dept: 'cashier' }).then(() => {
            console.log('post /create/scheduling cashier already')
         })
      })
      selectedKitchen.map((val) => {
         axios.post('http://10.0.2.2:81/create/scheduling', { sched_id: work_schedule['sched_id'], emp_id: val, dept: 'kitchen' }).then(() => {
            console.log('post /create/scheduling kitchen already')
         })
      })
      selectedWash.map((val) => {
         axios.post('http://10.0.2.2:81/create/scheduling', { sched_id: work_schedule['sched_id'], emp_id: val, dept: 'wash' }).then(() => {
            console.log('post /create/scheduling wash already')
         })
      })
      selectedStove.map((val) => {
         axios.post('http://10.0.2.2:81/create/scheduling', { sched_id: work_schedule['sched_id'], emp_id: val, dept: 'stove' }).then(() => {
            console.log('post /create/scheduling stove already')
         })
      })
      selectedWaiter.map((val) => {
         axios.post('http://10.0.2.2:81/create/scheduling', { sched_id: work_schedule['sched_id'], emp_id: val, dept: 'waiter' }).then(() => {
            console.log('post /create/scheduling waiter already')
         })
      })

   }

   const onSelectedItemsChange = (selectedItems) => {
      setSelectedItems(selectedItems)
      console.log('select: ' + selectedItems)
   };
   const onSelectedCashier = (selectedCashier) => {
      setSelectedCashier(selectedCashier)
      console.log('cashier: ' + selectedCashier)
   };
   const onSelectedKitchen = (selectedKitchen) => {
      setSelectedKitchen(selectedKitchen)
      console.log('kitchen: ' + selectedKitchen)
   };
   const onSelectedWash = (selectedWash) => {
      setSelectedWash(selectedWash)
      console.log('Wash: ' + selectedWash)
   };
   const onSelectedStove = (selectedStove) => {
      setSelectedStove(selectedStove)
      console.log('Stove: ' + selectedStove)
   };
   const onSelectedWaiter = (selectedWaiter) => {
      setSelectedWaiter(selectedWaiter)
      console.log('Waiter: ' + selectedWaiter)
   };

   const hasDuplicates = (array) => {
      return array.some((element, index) => array.indexOf(element) !== index)
   };
   const hasEmpty = () => {
      if (selectedCashier.length == 0) {
         return true
      } else if (selectedKitchen.length == 0) {
         return true
      } else if (selectedWash.length == 0) {
         return true
      } else if (selectedStove.length == 0) {
         return true
      } else if (selectedWaiter.length == 0) {
         return true
      } else {
         return false
      }
   };

   const handleSubmit = () => {
      const combinedArray = selectedCashier.concat(selectedKitchen, selectedWash, selectedStove, selectedWaiter);
      console.log('dept combined: ' + combinedArray);

      if (!hasDuplicates(combinedArray)) {
         if (!hasEmpty()) {
            console.log('Submitted')
            editScheduling()
            setShowAlert(true)
         } else {
            console.log('Empty')
            setShowInvalid2(true)
         }
      } else {
         console.log('Invalid')
         setShowInvalid(true)
      }
   };

   const handleDelete = () => {
      console.log(workSchedule['sched_id'], 'del ' + date.dateString)
      axios.delete('http://10.0.2.2:81/delete/work_schedule', {
         params: { sched_id: workSchedule['sched_id'] }
      }).catch(error => {
         console.log(error)
      })
      setShowAlert2(true)
   }

   const propHeader = () => {
      return (
         <VStack space={2}>
            <IconButton colorScheme='primary' variant={'solid'} borderRadius={'full'} boxSize={16} onPress={handleSubmit}>
               <Icon name={'save'} color={'white'} size={21} />
            </IconButton>
            <IconButton colorScheme='danger' variant={'solid'} boxSize={16} borderRadius={'full'} onPress={() => { setShowConfirm(true) }}>
               <Icon name="calendar-times-o" size={20} color="white" />
            </IconButton>
         </VStack>
      )
   };

   return (
      <NativeBaseProvider>
         <Header icon={'faCalendarDay'} color={'amber.500'} title={'เลือกพนักงาน'} subtitle={moment(date.dateString).format('D MMMM YYYY')} element={propHeader()} />

         {!isLoading ? (
            <ScrollView pt={5}>
               <Box mx={5} mb={5} justifyContent={'flex-start'} >
                  <Heading mb={2}>cashier</Heading>
                  <MultiSelect
                     items={cashier}
                     uniqueKey="emp_id"
                     displayKey="nname"
                     onSelectedItemsChange={onSelectedCashier}
                     selectedItems={selectedCashier}
                     selectText="เลือกพนักงาน"
                     searchInputPlaceholderText="ค้นหาพนักงาน..."
                     noItemsText="ไม่พบข้อมูลพนักงาน"
                     onChangeInput={(text) => console.log(text)}
                     tagRemoveIconColor="#7c2d12"
                     tagBorderColor="#7c2d12"
                     tagTextColor="#7c2d12"
                     selectedItemTextColor="#7c2d12"
                     selectedItemIconColor="#7c2d12"
                     itemTextColor="#000"
                     submitButtonColor="#16a34a"
                     submitButtonText="ยืนยัน"
                     styleListContainer={{ backgroundColor: 'white' }}
                     styleDropdownMenuSubsection={{ paddingLeft: 10, borderRadius: 15 }}
                     styleMainWrapper={{ paddingHorizontal: 10, paddingBottom: 10, backgroundColor: 'white', borderRadius: 15, borderBottomWidth: 5, borderColor: "#7c2d12" }}
                  />
               </Box >
               <Box mx={5} mb={5} justifyContent={'flex-start'} >
                  <Heading mb={2}>kitchen</Heading>
                  <MultiSelect
                     items={kitchen}
                     uniqueKey="emp_id"
                     displayKey="nname"
                     onSelectedItemsChange={onSelectedKitchen}
                     selectedItems={selectedKitchen}
                     selectText="เลือกพนักงาน"
                     searchInputPlaceholderText="ค้นหาพนักงาน..."
                     noItemsText="ไม่พบข้อมูลพนักงาน"
                     onChangeInput={(text) => console.log(text)}
                     tagRemoveIconColor="#7c2d12"
                     tagBorderColor="#7c2d12"
                     tagTextColor="#7c2d12"
                     selectedItemTextColor="#7c2d12"
                     selectedItemIconColor="#7c2d12"
                     itemTextColor="#000"
                     submitButtonColor="#16a34a"
                     submitButtonText="ยืนยัน"
                     styleListContainer={{ backgroundColor: 'white' }}
                     styleDropdownMenuSubsection={{ paddingLeft: 10, borderRadius: 15 }}
                     styleMainWrapper={{ paddingHorizontal: 10, paddingBottom: 10, backgroundColor: 'white', borderRadius: 15, borderBottomWidth: 5, borderColor: "#7c2d12" }}
                  />
               </Box >
               <Box mx={5} mb={5} justifyContent={'flex-start'} >
                  <Heading mb={2}>wash</Heading>
                  <MultiSelect
                     items={wash}
                     uniqueKey="emp_id"
                     displayKey="nname"
                     onSelectedItemsChange={onSelectedWash}
                     selectedItems={selectedWash}
                     selectText="เลือกพนักงาน"
                     searchInputPlaceholderText="ค้นหาพนักงาน..."
                     noItemsText="ไม่พบข้อมูลพนักงาน"
                     onChangeInput={(text) => console.log(text)}
                     tagRemoveIconColor="#7c2d12"
                     tagBorderColor="#7c2d12"
                     tagTextColor="#7c2d12"
                     selectedItemTextColor="#7c2d12"
                     selectedItemIconColor="#7c2d12"
                     itemTextColor="#000"
                     submitButtonColor="#16a34a"
                     submitButtonText="ยืนยัน"
                     styleListContainer={{ backgroundColor: 'white' }}
                     styleDropdownMenuSubsection={{ paddingLeft: 10, borderRadius: 15 }}
                     styleMainWrapper={{ paddingHorizontal: 10, paddingBottom: 10, backgroundColor: 'white', borderRadius: 15, borderBottomWidth: 5, borderColor: "#7c2d12" }}
                  />
               </Box >
               <Box mx={5} mb={5} justifyContent={'flex-start'} >
                  <Heading mb={2}>stove</Heading>
                  <MultiSelect
                     items={stove}
                     uniqueKey="emp_id"
                     displayKey="nname"
                     onSelectedItemsChange={onSelectedStove}
                     selectedItems={selectedStove}
                     selectText="เลือกพนักงาน"
                     searchInputPlaceholderText="ค้นหาพนักงาน..."
                     noItemsText="ไม่พบข้อมูลพนักงาน"
                     onChangeInput={(text) => console.log(text)}
                     tagRemoveIconColor="#7c2d12"
                     tagBorderColor="#7c2d12"
                     tagTextColor="#7c2d12"
                     selectedItemTextColor="#7c2d12"
                     selectedItemIconColor="#7c2d12"
                     itemTextColor="#000"
                     submitButtonColor="#16a34a"
                     submitButtonText="ยืนยัน"
                     styleListContainer={{ backgroundColor: 'white' }}
                     styleDropdownMenuSubsection={{ paddingLeft: 10, borderRadius: 15 }}
                     styleMainWrapper={{ paddingHorizontal: 10, paddingBottom: 10, backgroundColor: 'white', borderRadius: 15, borderBottomWidth: 5, borderColor: "#7c2d12" }}
                  />
               </Box >
               <Box mx={5} mb={5} justifyContent={'flex-start'} >
                  <Heading mb={2}>waiter</Heading>
                  <MultiSelect
                     items={waiter}
                     uniqueKey="emp_id"
                     displayKey="nname"
                     onSelectedItemsChange={onSelectedWaiter}
                     selectedItems={selectedWaiter}
                     selectText="เลือกพนักงาน"
                     searchInputPlaceholderText="ค้นหาพนักงาน..."
                     noItemsText="ไม่พบข้อมูลพนักงาน"
                     onChangeInput={(text) => console.log(text)}
                     tagRemoveIconColor="#7c2d12"
                     tagBorderColor="#7c2d12"
                     tagTextColor="#7c2d12"
                     selectedItemTextColor="#7c2d12"
                     selectedItemIconColor="#7c2d12"
                     itemTextColor="#000"
                     submitButtonColor="#16a34a"
                     submitButtonText="ยืนยัน"
                     styleListContainer={{ backgroundColor: 'white' }}
                     styleDropdownMenuSubsection={{ paddingLeft: 10, borderRadius: 15 }}
                     styleMainWrapper={{ paddingHorizontal: 10, paddingBottom: 10, backgroundColor: 'white', borderRadius: 15, borderBottomWidth: 5, borderColor: "#7c2d12" }}
                  />
               </Box >
               <Box m={5}></Box>

            </ScrollView>
         ) : (
            <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
               <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
               <Heading color="#7c2d12" fontSize="md">
                  กำลังโหลดข้อมูล
               </Heading>
            </HStack>
         )}

         <AwesomeAlert
            show={showConfirm}
            customView={<Modal mode={'confirm'} title={'ยืนยันลบข้อมูลตารางงาน'} desc={'คุณต้องการลบข้อมูลตารางงานนี้หรือไม่'} />}
            onDismiss={() => { setShowConfirm(false) }}
            contentContainerStyle={{ width: '80%' }}
            showConfirmButton={true}
            confirmButtonColor={'#16a34a'}
            onConfirmPressed={handleDelete}
            showCancelButton={true}
            cancelButtonColor={'#a3a3a3'}
            onCancelPressed={() => { setShowConfirm(false) }}
         />
         <AwesomeAlert
            show={showAlert}
            customView={<Modal mode={'success'} title={'บันทึกตารางงานสำเร็จ'} />}
            contentContainerStyle={{ width: '80%' }}
            onDismiss={() => { navigation.navigate('Schedule') }}
         />
         <AwesomeAlert
            show={showAlert2}
            customView={<Modal mode={'success'} title={'ลบตารางงานสำเร็จ'} />}
            contentContainerStyle={{ width: '80%' }}
            onDismiss={() => { navigation.navigate('Schedule') }}
         />
         <AwesomeAlert
            show={showInvalid}
            customView={<Modal mode={'invalid'} title={'ข้อมูลซ้ำ'} desc={'มีพนักงานทำงานเกิน 1 ตำแหน่ง'} />}
            contentContainerStyle={{ width: '80%' }}
            onDismiss={() => { setShowInvalid(false) }}
         />
         <AwesomeAlert
            show={showInvalid2}
            customView={<Modal mode={'invalid'} title={'ข้อมูลไม่ครบ'} desc={'แต่ละแผนกต้องมีพนักงานอย่างน้อย 1 คน'} />}
            contentContainerStyle={{ width: '80%' }}
            onDismiss={() => { setShowInvalid2(false) }}
         />

      </NativeBaseProvider>
   )
}

export default EditSchedule