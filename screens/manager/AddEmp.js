import React, { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import { NativeBaseProvider, Box, Text, VStack, FormControl, Input, Heading, Select, CheckIcon, Checkbox, ScrollView, Button, IconButton } from 'native-base'
import axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker'
import MultiSelect from 'react-native-multiple-select'
import AwesomeAlert from 'react-native-awesome-alerts'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import Header from '../../components/Header'
import Modal from '../../components/Modal'

const AddEmp = ({ navigation }) => {
   const [showAlert, setShowAlert] = useState(false)

   const [nname, setNname] = useState('')
   const [password, setPassword] = useState('')
   const [title, setTitle] = useState('')
   const [dept, setDept] = useState([])
   const [date, setDate] = useState(new Date('5555'))
   const [show, setShow] = useState(false)
   const [showDate, setShowDate] = useState('กรุณาเลือกวันที่')
   const [fname, setFname] = useState('')
   const [lname, setLname] = useState('')
   const [birthDate, setBirthDate] = useState(new Date('5555'))
   const [show2, setShow2] = useState(false)
   const [showBirthDate, setShowBirthDate] = useState('กรุณาเลือกวันที่')
   const [phone, setPhone] = useState('')
   const [line_account, setLine_account] = useState('')
   const [errors, setErrors] = useState({
      nname: '',
      password: '',
      job_title: '',
      dept: '',
      job_start: '',
      fname: '',
      lname: '',
      birthDate: '',
      phone: '',
      line_account: '',
   });

   const addEmployee = async () => {
      try {
         await axios.post(process.env.SERVER + '/create/emp', {
            line_account: line_account,
            password: password,
            fname: fname,
            lname: lname,
            nname: nname,
            phone: phone,
            job_title: title,
            job_start: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
            birthdate: birthDate.getFullYear() + '-' + (birthDate.getMonth() + 1) + '-' + birthDate.getDate(),
         }).then(response => {
            console.log('post /create/emp already');
         })

         dept.map((val) => {
            axios.post(process.env.SERVER + '/create/dept', { dept_name: val }).then(() => {
               console.log('post /create/dept already')
            })
         })

         axios.post(process.env.SERVER + '/create/work_history').then(() => {
            console.log('post /create/work_history already')
         })
         axios.post(process.env.SERVER + '/create/evaluate').then(() => {
            console.log('post /create/evaluate already')
         })
      } catch (error) {
         console.log(error)
      }
   };

   const validate = () => {
      const newErrors = {}

      if (!nname) {
         newErrors.nname = 'กรุณากรอกชื่อเล่น'
      }
      if (!password) {
         newErrors.password = 'กรุณากรอกรหัสผ่าน'
      }
      if (!title) {
         newErrors.title = 'กรุณาเลือกตำแหน่ง'
      }
      if (dept.length === 0) {
         newErrors.dept = 'กรุณาเลือกอย่างน้อย 1 งาน'
      }
      if (date.getFullYear().toString() === '5555') {
         newErrors.date = 'กรุณาระบุวันเข้าทำงาน'
      }
      if (!fname) {
         newErrors.fname = 'กรุณากรอกชื่อจริง'
      }
      if (!lname) {
         newErrors.lname = 'กรุณากรอกนามสกุล'
      }
      if (birthDate.getFullYear().toString() === '5555') {
         newErrors.birthDate = 'กรุณาระบุวันเกิด'
      }
      if (!phone) {
         newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์'
      } else if (phone.toString().length < 10) {
         newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง'
      }
      if (!line_account) {
         newErrors.line_account = 'กรุณากรอกบัญชีไลน์'
      }

      setErrors(newErrors)
      return Object.values(newErrors).length === 0;
   };

   const handleSubmit = () => {
      if (validate()) {
         console.log('Submitted')
         addEmployee()
         setShowAlert(true)
      } else console.log('Invalid')
   };

   const onChangeDate = (e, selectedDate) => {
      console.log('date:' + date);
      const currentDate = selectedDate || date
      setShow(Platform.OS === 'ios')
      setDate(currentDate)

      let tempDate = new Date(currentDate)
      let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear()
      setShowDate(fDate)
   };

   const onChangeBirthDate = (e, selectedDate) => {
      const currentDate = selectedDate || birthDate
      setShow2(Platform.OS === 'ios')
      setBirthDate(currentDate)

      let tempDate = new Date(currentDate)
      let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear()
      setShowBirthDate(fDate)
   };

   const onSelectedDept = (selectedDept) => {
      setDept(selectedDept)
      console.log('Dept: ' + dept)
   };

   const propHeader = () => {
      return (
         <IconButton colorScheme='primary' variant={'solid'} borderRadius={'full'} boxSize={16} onPress={handleSubmit}>
            <FontAwesomeIcon icon={faSave} color={'white'} size={22} />
         </IconButton>
      )
   };

   return (
      <NativeBaseProvider>
         <Header icon={'faUserPlus'} color={'success.600'} title={'เพิ่มข้อมูลพนักงาน'} element={propHeader()} />
         <ScrollView>
            <VStack space={5} m={5}>

               {/* ข้อมูลบัญชี */}
               <Box bgColor={'white'} p={5} borderRadius={25} shadow={3}>
                  <Heading alignSelf={'center'}>ข้อมูลบัญชี</Heading>
                  <FormControl isRequired isInvalid={!!errors.nname}>
                     <FormControl.Label>ชื่อเล่น</FormControl.Label>
                     <Input type="text" value={nname} onChangeText={e => setNname(e)} placeholder="ชื่อเล่น" />
                     {!!errors.nname && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.nname} </Text>}
                  </FormControl>
                  <FormControl isRequired isInvalid={!!errors.password}>
                     <FormControl.Label>รหัสผ่าน</FormControl.Label>
                     <Input type="text" value={password} onChangeText={e => setPassword(e)} placeholder="รหัสผ่าน" />
                     {!!errors.password && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.password} </Text>}
                  </FormControl>
               </Box>

               {/* ข้อมูลพนักงาน */}
               <Box bgColor={'white'} p={5} borderRadius={25} shadow={3}>
                  <Heading alignSelf={'center'}>ข้อมูลพนักงาน</Heading>
                  <FormControl isRequired isInvalid={!!errors.title}>
                     <FormControl.Label>ตำแหน่ง</FormControl.Label>
                     <Select selectedValue={title} minWidth="200" accessibilityLabel="เลือกตำแน่ง" placeholder="เลือกตำแน่ง"
                        _selectedItem={{ bg: "amber.600", endIcon: <CheckIcon size="5" /> }} mt={1}
                        onValueChange={itemValue => setTitle(itemValue)}>
                        <Select.Item label="พนักงานประจำ" value="full-time" />
                        <Select.Item label="พนักงานชั่วคราว" value="part-time" />
                        <Select.Item label="ผู้จัดการ" value="manager" />
                     </Select>
                     {!!errors.title && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.title} </Text>}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.dept}>
                     <FormControl.Label>ข้อมูลงาน</FormControl.Label>
                     <MultiSelect
                        items={[
                           { key: 'cashier', name: 'แคชเชียร์' },
                           { key: 'kitchen', name: 'ครัว' },
                           { key: 'wash', name: 'ล้างจาน' },
                           { key: 'stove', name: 'เตา' },
                           { key: 'waiter', name: 'หน้าร้าน' }
                        ]}
                        uniqueKey="key" displayKey="name"
                        onSelectedItemsChange={onSelectedDept}
                        selectedItems={dept}
                        selectText="เลือกแผนกงาน" textColor="#a9a9a9"
                        styleInputGroup={{ display: 'none' }}
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
                        styleMainWrapper={{ borderRadius: 5, borderWidth: 1, borderColor: "#dadada" }}
                     />
                     {!!errors.dept && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.dept} </Text>}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.date}>
                     <FormControl.Label>วันเข้าทำงาน</FormControl.Label>
                     <Button colorScheme={'amber'} variant="outline" onPress={() => { setShow(true) }}>
                        {(date.getFullYear().toString() === '5555') ? 'กรุณาเลือกวันที่' : showDate}
                        {show && (<DateTimePicker
                           value={date}
                           mode={'date'}
                           display={'default'}
                           maximumDate={new Date()}
                           onChange={onChangeDate}
                        />)}
                     </Button>
                     {!!errors.date && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.date} </Text>}
                  </FormControl>
               </Box>

               {/* ข้อมูลส่วนตัว */}
               <Box bgColor={'white'} p={5} borderRadius={25} shadow={3}>
                  <Heading alignSelf={'center'}>ข้อมูลส่วนตัว</Heading>
                  <FormControl isRequired isInvalid={!!errors.fname}>
                     <FormControl.Label>ชื่อจริง</FormControl.Label>
                     <Input type="text" value={fname} onChangeText={e => setFname(e)} placeholder="ชื่อจริง" />
                     {!!errors.fname && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.fname} </Text>}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.lname}>
                     <FormControl.Label>นามสกุล</FormControl.Label>
                     <Input type="text" value={lname} onChangeText={e => setLname(e)} placeholder="นามสกุล" />
                     {!!errors.lname && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.lname} </Text>}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.birthDate}>
                     <FormControl.Label>วันเกิด</FormControl.Label>
                     <Button colorScheme={'amber'} variant="outline" onPress={() => { setShow2(true) }}>
                        {(birthDate.getFullYear().toString() === '5555') ? 'กรุณาเลือกวันที่' : showBirthDate}
                        {show2 && (<DateTimePicker
                           value={birthDate}
                           mode={'date'}
                           display={'default'}
                           maximumDate={new Date()}
                           onChange={onChangeBirthDate}
                        />)}
                     </Button>
                     {!!errors.birthDate && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.birthDate} </Text>}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.phone}>
                     <FormControl.Label>เบอร์โทรศัพท์</FormControl.Label>
                     <Input type="text" keyboardType='number-pad' maxLength={10} value={phone} onChangeText={e => setPhone(e)} placeholder="เบอร์โทรศัพท์" />
                     {!!errors.phone && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.phone} </Text>}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.line_account}>
                     <FormControl.Label>บัญชีไลน์</FormControl.Label>
                     <Input type="text" value={line_account} onChangeText={e => setLine_account(e)} placeholder="บัญชีไลน์" />
                     {!!errors.line_account && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.line_account} </Text>}
                  </FormControl>
               </Box>

               <AwesomeAlert
                  show={showAlert}
                  customView={<Modal mode={'success'} title={'เพิ่มข้อมูลสำเร็จ'} />}
                  contentContainerStyle={{ width: '80%' }}
                  onDismiss={() => { navigation.navigate('Emp') }}
               />

            </VStack>
         </ScrollView>
      </NativeBaseProvider>
   )
}

export default AddEmp