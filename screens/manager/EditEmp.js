import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Text, VStack, FormControl, Input, Heading, Select, CheckIcon, Checkbox, ScrollView, Button, IconButton } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker'
import AwesomeAlert from 'react-native-awesome-alerts'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import Header from '../../components/Header'
import Modal from '../../components/Modal'

const EditEmp = ({ route }) => {
   const navigation = useNavigation()

   const [item, setitem] = useState({})
   const [isLoading, setIsLoading] = useState(true)
   const [showAlert, setShowAlert] = useState(false)

   const [nname, setNname] = useState(item.nname)
   const [password, setPassword] = useState(item.password)
   const [title, setTitle] = useState('')
   const [dept, setDept] = useState('')
   const defDate = moment(item.job_start).toDate()
   const date = defDate.getDate() + '/' + defDate.getMonth() + '/' + defDate.getFullYear()
   const [fname, setFname] = useState('')
   const [lname, setLname] = useState('')
   const defBirthDate = moment(item.birthdate).toDate()
   // const birthDate = defBirthDate
   const birthDate = defBirthDate.getDate() + '/' + defBirthDate.getMonth() + '/' + defBirthDate.getFullYear()
   const [phone, setPhone] = useState('')
   const [line_account, setLine_account] = useState('')
   const [errors, setErrors] = useState({
      nname: '',
      password: '',
      job_title: '',
      dept: '',
      fname: '',
      lname: '',
      phone: '',
      line_account: '',
   });

   useEffect(() => {
      axios.get('http://10.0.2.2:81/read/empdetail/' + route.params.id).then((res) => {
         setitem(res.data)
         setTitle(res.data.job_title)
         // ต้อง set ทีละตัวจะได้ค่าเริ่มต้นใน useState หรือแก้ไปใช้ item แทน
         setPassword(res.data.password)
         // setDept([...def.split(',')])
         // console.log('title:' + title);
         // console.log('dept:' + dept[1]);
         setIsLoading(false)

      })
   }, [isLoading])

   const defaultCheckbox = () => {

   }

   const updateEmployee = () => {
      if (validate()) {
         axios.put('http://10.0.2.2:81/update/emp', {
            id: id,
            line_account: line_account,
            password: password,
            fname: fname,
            lname: lname,
            nname: nname,
            phone: phone,
            job_title: title,
            dept: JSON.stringify(dept).replace(/[\[\]"]/g, ''),
         }).then(response => {
            console.log(response.data)
         }).catch(error => {
            console.log(error)
         })
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
      if (!JSON.stringify(dept).replace(/[\[\]]/g, '')) {
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
         updateEmployee
         setShowAlert(true)
      } else console.log('Invalid')
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
                  <FormControl isRequired isInvalid={!!errors.nname}>
                     <FormControl.Label>ชื่อเล่น</FormControl.Label>
                     <Input type="text" defaultValue={item.nname} value={nname} onChangeText={e => setNname(e)} placeholder="ชื่อเล่น" />
                     {!!errors.nname && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.nname} </Text>}
                  </FormControl>
                  <FormControl isRequired isInvalid={!!errors.password}>
                     <FormControl.Label>รหัสผ่าน</FormControl.Label>
                     {console.log('pass:'+password)}
                     <Input type="text" defaultValue={password}  value={password} onChangeText={e => setPassword(e)} placeholder="รหัสผ่าน" />
                     {!!errors.password && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.password} </Text>}
                  </FormControl>
               </Box>

               <Text>{item.dept}</Text>
               <Text>{dept}</Text>
               {/* ข้อมูลพนักงาน */}
               <Box bgColor={'white'} p={5} borderRadius={25} shadow={3}>
                  <Heading alignSelf={'center'}>ข้อมูลพนักงาน</Heading>
                  <FormControl isRequired isInvalid={!!errors.title}>
                     <FormControl.Label>ตำแหน่ง</FormControl.Label>
                     <Select defaultValue={item.job_title} selectedValue={title} minWidth="200" placeholder="เลือกตำแน่ง"
                        _selectedItem={{ bg: 'amber.600', endIcon: <CheckIcon size="5" /> }} mt={1}
                        onValueChange={itemValue => setTitle(itemValue)}>
                        <Select.Item label="พนักงานประจำ" value='full-time' />
                        <Select.Item label="พนักงานชั่วคราว" value="part-time" />
                        <Select.Item label="ผู้จัดการ" value="manager" />
                     </Select>
                     {!!errors.title && <Text m={1} fontSize={'xs'} color={'error.500'}>{errors.title} </Text>}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.dept}>
                     <FormControl.Label>ข้อมูลงาน</FormControl.Label>
                     <Checkbox.Group defaultValue={item.dept} onChange={values => { setDept(values || []) }}>
                        <Checkbox value="แคชเชียร์">แคชเชียร์</Checkbox>
                        <Checkbox value="ครัว">ครัว</Checkbox>
                        <Checkbox value="ล้างจาน">ล้างจาน</Checkbox>
                        <Checkbox value="เตา">เตา</Checkbox>
                        <Checkbox value="หน้าร้าน">หน้าร้าน</Checkbox>
                     </Checkbox.Group>
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
                  onDismiss={() => { navigation.navigate('Emp') }}
                  contentContainerStyle={{ width: '80%' }}
               />

            </VStack>
         </ScrollView>
      </NativeBaseProvider>
   )
}

export default EditEmp