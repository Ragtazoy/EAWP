import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Text, VStack, FormControl, Input, Heading, Select, CheckIcon, Checkbox, ScrollView, Button, IconButton } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker'
import MultiSelect from 'react-native-multiple-select'
import AwesomeAlert from 'react-native-awesome-alerts'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import Header from '../../components/Header'
import Modal from '../../components/Modal'

const EditEmp = ({ route, navigation }) => {
   const [isLoading, setIsLoading] = useState(true)
   const [showAlert, setShowAlert] = useState(false)
   const [isEmp, setIsEmp] = useState(false)

   const [nname, setNname] = useState('')
   const [password, setPassword] = useState('')
   const [title, setTitle] = useState('')
   const [dept, setDept] = useState([])
   const [date, setDate] = useState('')

   const [fname, setFname] = useState('')
   const [lname, setLname] = useState('')
   const [birthDate, setBirthDate] = useState('')
   const [phone, setPhone] = useState('')
   const [line_account, setLine_account] = useState('')
   const [errors, setErrors] = useState({
      nname: '',
      password: '',
      title: '',
      dept: '',
      fname: '',
      lname: '',
      phone: '',
      line_account: '',
   });

   useEffect(() => {
      axios.get('http://10.0.2.2:81/read/empdetail/' + route.params.id).then((res) => {
         setNname(res.data.nname)
         setPassword(res.data.password)
         setTitle(res.data.job_title)
         setDept(res.data.dept.split(', '))
         setDate(moment(res.data.job_start).format('DD/MM/YYYY'))
         setFname(res.data.fname)
         setLname(res.data.lname)
         setBirthDate(moment(res.data.birthdate).format('DD/MM/YYYY'))
         setPhone(res.data.phone)
         setLine_account(res.data.line_account)

      }).then(async () => {
         const userId = await AsyncStorage.getItem('userId');

         await axios.get('http://10.0.2.2:81/read/empdetail/' + userId).then((res) => {
            console.log(res.data.job_title);
            res.data.job_title !== 'manager' ? setIsEmp(true) : setIsEmp(false)

            setIsLoading(false)
         })
      })
   }, [isLoading])

   const updateEmployee = async () => {
      console.log('updated', route.params.id, dept);
      axios.put('http://10.0.2.2:81/update/emp', {
         id: route.params.id,
         fname: fname,
         lname: lname,
         nname: nname,
         password: password,
         line_account: line_account,
         phone: phone,
         job_title: title
      })

      await axios.delete('http://10.0.2.2:81/delete/department/' + route.params.id)

      dept.map((val) => {
         axios.post('http://10.0.2.2:81/create/dept', { dept_name: val })
      })
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
      if (!date) {
         newErrors.date = 'กรุณาระบุวันเข้าทำงาน'
      }
      if (!fname) {
         newErrors.fname = 'กรุณากรอกชื่อจริง'
      }
      if (!lname) {
         newErrors.lname = 'กรุณากรอกนามสกุล'
      }
      if (!birthDate) {
         newErrors.birthDate = 'กรุณาระบุวันเกิด'
      }
      if (!phone) {
         newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์'
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
         updateEmployee()
         setShowAlert(true)
      } else console.log('Invalid')
   };

   const onSelectedDept = (selectedDept) => {
      isEmp ? null : setDept(selectedDept)
      console.log('Dept: ' + dept)
   };

   const propSave = () => {
      return (
         <IconButton colorScheme='primary' variant={'solid'} borderRadius={'full'} boxSize={16} onPress={handleSubmit}>
            <FontAwesomeIcon icon={faSave} color={'white'} size={22} />
         </IconButton>
      )
   };

   return (
      <NativeBaseProvider>
         <Header icon={'faUserEdit'} color={'amber.500'} title={'แก้ไขข้อมูลพนักงาน'} element={propSave()} />
         <ScrollView>
            <VStack space={5} m={5}>

               {/* ข้อมูลบัญชี */}
               <Box bgColor={'white'} p={5} borderRadius={25} shadow={3}>
                  <Heading alignSelf={'center'}>ข้อมูลบัญชี</Heading>
                  <FormControl isDisabled={isEmp} isRequired isInvalid={!!errors.nname}>
                     <FormControl.Label>ชื่อเล่น</FormControl.Label>
                     <Input type="text" defaultValue={nname} value={nname} onChangeText={e => setNname(e)} placeholder="ชื่อเล่น" />
                     {!!errors.nname && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.nname} </Text>}
                  </FormControl>
                  <FormControl isRequired isInvalid={!!errors.password}>
                     <FormControl.Label>รหัสผ่าน</FormControl.Label>
                     <Input type="text" defaultValue={password} value={password} onChangeText={e => setPassword(e)} placeholder="รหัสผ่าน" />
                     {!!errors.password && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.password} </Text>}
                  </FormControl>
               </Box>

               {/* ข้อมูลพนักงาน */}
               <Box bgColor={'white'} p={5} borderRadius={25} shadow={3}>
                  <Heading alignSelf={'center'}>ข้อมูลพนักงาน</Heading>
                  <FormControl isDisabled={isEmp} isRequired isInvalid={!!errors.title}>
                     <FormControl.Label>ตำแหน่ง</FormControl.Label>
                     <Select defaultValue={title} selectedValue={title} onValueChange={e => setTitle(e)}
                        minWidth="200" placeholder="เลือกตำแน่ง"
                        _selectedItem={{ bg: 'amber.600', endIcon: <CheckIcon size="5" /> }} mt={1}>
                        <Select.Item label="พนักงานประจำ" value='full-time' />
                        <Select.Item label="พนักงานชั่วคราว" value="part-time" />
                        <Select.Item label="ผู้จัดการ" value="manager" />
                     </Select>
                     {!!errors.title && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.title} </Text>}
                  </FormControl>

                  <FormControl isDisabled={isEmp} isRequired isInvalid={!!errors.dept}>
                     <FormControl.Label>ข้อมูลงาน</FormControl.Label>
                     <MultiSelect
                        items={[
                           { key: 'cashier', name: 'แคชเชียร์', disabled: isEmp },
                           { key: 'kitchen', name: 'ครัว', disabled: isEmp },
                           { key: 'wash', name: 'ล้างจาน', disabled: isEmp },
                           { key: 'stove', name: 'เตา', disabled: isEmp },
                           { key: 'waiter', name: 'หน้าร้าน', disabled: isEmp }
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


                  <FormControl isDisabled isInvalid={!!errors.date}>
                     <FormControl.Label>วันเข้าทำงาน</FormControl.Label>
                     <Button disabled={true} colorScheme={'amber'} variant="outline" onPress={() => { setShow(true) }}>
                        {date}
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

                  <FormControl isDisabled isInvalid={!!errors.birthDate}>
                     <FormControl.Label>วันเกิด</FormControl.Label>
                     <Button disabled={true} colorScheme={'amber'} variant="outline" onPress={() => { setShow2(true) }}>
                        {birthDate}
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
                  onDismiss={() => { setShowAlert(false); navigation.navigate('ProfileMng') }}
                  contentContainerStyle={{ width: '80%' }}
               />

            </VStack>
         </ScrollView>
      </NativeBaseProvider>
   )
}

export default EditEmp