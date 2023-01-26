import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Divider, Heading, Text, Flex, HStack, IconButton, FlatList, VStack, Pressable, Spinner } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component'
import DataTable, { COL_TYPES } from 'react-native-datatable-component'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import Cards from '../../components/Cards'

const Emp = () => {
   const [items, setItems] = useState([])
   const [countEmp, setCountEmp] = useState([])
   const [isLoading, setIsLoading] = useState(true)
   const navigation = useNavigation()

   useEffect(() => {
      const getDate = async () => {
         await navigation.addListener('focus', () => setIsLoading(true))

         await axios.get('http://10.0.2.2:81/read/count_emp_by_job_title').then((res) => {
            setCountEmp(res.data)
         })
         await axios.get('http://10.0.2.2:81/read/emplist').then((res) => {
            setItems(res.data)
         })

         setIsLoading(false)
      }
      getDate()
   }, [isLoading])


   const renderItem = ({ item }) => (

      <Pressable bgColor={'white'} onPress={() => { navigation.navigate('ProfileMng', { id: item.emp_id }) }}>
         <Divider />
         <Flex my={2} direction="row" alignItems={'center'}>
            <Box flex={0.25}>
               <Text alignSelf={'center'}>{item.nname}</Text>
            </Box>
            <Box flex={0.25}>
               <Text alignSelf={'center'}>{item.job_title}</Text>
            </Box>
            <Box flex={0.5}>
               <Text alignSelf={'center'}>{item.dept}</Text>
            </Box>
            {/* <Box flex={0.25}>
               <Text alignSelf={'center'}>{item.emp_id}</Text>
            </Box> */}
         </Flex>
      </Pressable>
   )

   const handlePress = (d) => {
      // Do something with the data here, such as send it to another screen
      alert('dddd: ' + d);
   };

   const data = [
      ['1', 'John', 'Doe'],
      ['2', 'Jane', 'Doe'],
      ['3', 'John', 'Smith'],
   ];

   return (
      <NativeBaseProvider>
         <VStack>
            {!isLoading ? (
               <HStack space={4} p={5}>
                  <Cards color={'green.400'} text={'พนักงานประจำ'} heading={countEmp['full-time'] + ' คน'} />
                  <Cards color={'amber.300'} text={'พนักงานชั่วคราว'} heading={countEmp['part-time'] + ' คน'} />
               </HStack>
            ) : (
               <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
                  <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
                  <Heading color="#7c2d12" fontSize="md">
                     กำลังโหลดข้อมูล
                  </Heading>
               </HStack>
            )}

            <HStack h={70} borderTopRadius={50} shadow={1} justifyContent={'space-around'} alignItems={'center'} bgColor={'white'}>
               <Heading>รายชื่อพนักงาน</Heading>
               <IconButton colorScheme='success' variant={'solid'} borderRadius={25} Size={45} onPress={() => navigation.navigate('AddEmp')}>
                  <FontAwesomeIcon icon={faUserPlus} color={'white'} size={20} />
               </IconButton>
            </HStack>

            <HStack bgColor={'#7c2d12'} h={10} py={1} alignItems={'center'}>
               <Box flex={0.25}>
                  <Text alignSelf={'center'} color={'white'}>ชื่อ</Text>
               </Box>
               <Divider orientation="vertical" mx="1" />
               <Box flex={0.25}>
                  <Text alignSelf={'center'} color={'white'}>ตำแหน่ง</Text>
               </Box>
               <Divider orientation="vertical" mx="1" />
               <Box flex={0.5}>
                  <Text alignSelf={'center'} color={'white'}>แผนก</Text>
               </Box>
               {/* <Divider orientation="vertical" mx="1" />
               <Box flex={0.25}>
                  <Text alignSelf={'center'} color={'white'}>คะแนน</Text>
               </Box> */}
            </HStack>

            {!isLoading ? (
               <FlatList h={'420'}
                  data={items} renderItem={renderItem} keyExtractor={item => item.emp_id}
                  refreshing={isLoading} onRefresh={() => setIsLoading(true)} />
            ) : (
               <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
                  <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
                  <Heading color="#7c2d12" fontSize="md">
                     กำลังโหลดข้อมูล
                  </Heading>
               </HStack>
            )}

            {/* <Box> */}
            {/* <Table>
                  <Row data={['Name', 'Age']} style={{ backgroundColor: 'red' }} />
                  <Rows data={data} onPress={(d) => handlePress(d)} />
               </Table> */}
            {/* <Table>
                  <Row data={data[0]} style={{ backgroundColor: 'red' }} onPress={() => onRowPress(data[0])} />
                  <Rows data={data} onPress={() => onRowPress(data)} />
               </Table> */}

            {/* <DataTable
                  onRowSelect={(row) => {console.log('ROW => ',row)}}
                  data={[
                     { name: 'Muhammad Rafeh', age: 21, gender: 'male' },
                     { name: 'Muhammad Akif', age: 22, gender: 'male' },
                     { name: 'Muhammad Umar', age: 21, gender: 'male' },
                     { name: 'Amna Shakeel', age: 22, gender: 'female' },
                     { name: 'Amna Shakeel', age: 22, gender: 'female' },
                     { name: 'Amna Shakeel', age: 22, gender: 'female' },
                     { name: 'Muhammad Ammar', age: 20, gender: 'male' },
                     { name: 'Muhammad Akif', age: 22, gender: 'male' },
                     { name: 'Muhammad Umar', age: 21, gender: 'male' },
                     { name: 'Amna Shakeel', age: 22, gender: 'female' },
                     { name: 'Muhammad Ammar', age: 20, gender: 'male' },
                     { name: 'Muhammad Moiz', age: 13, gender: 'male' }
                  ]}
                  colNames={['name', 'age', 'gender']}
                  colSettings={[
                     { name: 'name', type: COL_TYPES.STRING, width: '40%' },
                     { name: 'age', type: COL_TYPES.INT, width: '30%' },
                     { name: 'gender', type: COL_TYPES.STRING, width: '30%' }
                  ]}
                  noOfPages={2}
                  backgroundColor={'white'}
                  headerLabelStyle={{ color: 'grey', fontSize: 16 }}
               /> */}
            {/* </Box> */}

         </VStack>
      </NativeBaseProvider>
   )
}

export default Emp