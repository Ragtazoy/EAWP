import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Heading, IconButton, ScrollView, Spinner, HStack } from 'native-base'
import axios from 'axios'
import moment from 'moment'
import MultiSelect from 'react-native-multiple-select'
import AwesomeAlert from 'react-native-awesome-alerts'
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Header from '../../components/Header'
import Modal from '../../components/Modal'

const AddSchedule = ({ route, navigation }) => {
   const { date } = route.params
   const [emp, setEmp] = useState([])
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

   const [selectedItems, setSelectedItems] = useState([])

   const [showAlert, setShowAlert] = useState(false)
   const [showInvalid, setShowInvalid] = useState(false)
   const [showInvalid2, setShowInvalid2] = useState(false)
   const [isLoading, setIsLoading] = useState(true)


   useEffect(() => {
      getEmpDept()
   }, [isLoading])

   const getEmpDept = async () => {
      await axios.get(process.env.SERVER + '/read/empdept').then((res) => {

         ['cashier', 'kitchen', 'wash', 'stove', 'waiter'].forEach((dept) => {
            const empInDept = res.data.filter(item => item.dept_name === dept)
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

   const AddWorkSchedule = async () => {
      await axios.post(process.env.SERVER + '/create/work_schedule', { date: date.dateString }).then(() => {
         console.log('post /create/work_schedule already')
      })
      selectedCashier.map((val) => {
         axios.post(process.env.SERVER + '/create/scheduling', { emp_id: val, dept: 'cashier' }).then(() => {
            console.log('post /create/scheduling cashier already')
         })
      })
      selectedKitchen.map((val) => {
         axios.post(process.env.SERVER + '/create/scheduling', { emp_id: val, dept: 'kitchen' }).then(() => {
            console.log('post /create/scheduling kitchen already')
         })
      })
      selectedWash.map((val) => {
         axios.post(process.env.SERVER + '/create/scheduling', { emp_id: val, dept: 'wash' }).then(() => {
            console.log('post /create/scheduling wash already')
         })
      })
      selectedStove.map((val) => {
         axios.post(process.env.SERVER + '/create/scheduling', { emp_id: val, dept: 'stove' }).then(() => {
            console.log('post /create/scheduling stove already')
         })
      })
      selectedWaiter.map((val) => {
         axios.post(process.env.SERVER + '/create/scheduling', { emp_id: val, dept: 'waiter' }).then(() => {
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
            AddWorkSchedule()
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

   const propHeader = () => {
      return (
         <IconButton colorScheme='primary' variant={'solid'} borderRadius={'full'} boxSize={16} onPress={handleSubmit}>
            <Icon2 name={'save'} color={'white'} size={21} />
         </IconButton>
      )
   };

   
   return (
      <NativeBaseProvider>
         <Header icon={'faCalendarDay'} color={'amber.500'} title={'เลือกพนักงาน'} subtitle={moment(date.dateString).format('D MMMM YYYY')} element={propHeader()} />

         {!isLoading ? (
            <ScrollView pt={5}>
               <Box mx={5} mb={5} justifyContent={'flex-start'} >
                  <Heading mb={2}>Cashier</Heading>
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
                  <Heading mb={2}>Kitchen</Heading>
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
                  <Heading mb={2}>Wash</Heading>
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
                  <Heading mb={2}>Stove</Heading>
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
                  <Heading mb={2}>Waiter</Heading>
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
               {/* {['Cashier', 'wash'].map((dept) => {
            return <Box mx={5} mb={5} justifyContent={'flex-start'} >
               <Heading mb={2}>{dept}</Heading>
               <MultiSelect
                  items={emp}
                  uniqueKey="emp_id"
                  displayKey="nname"
                  onSelectedItemsChange={onSelectedItemsChange}
                  selectedItems={selectedItems}
                  selectText="เลือกพนักงาน"
                  searchInputPlaceholderText="ค้นหาพนักงาน..."
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
         })} */}

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
            show={showAlert}
            customView={<Modal mode={'success'} title={'บันทึกตารางงานสำเร็จ'} />}
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

export default AddSchedule