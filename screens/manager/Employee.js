import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Divider, Heading, Text, Flex, HStack, IconButton, FlatList, VStack, Pressable } from 'native-base'
import { useNavigation } from '@react-navigation/native';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component'
import DataTable, { COL_TYPES } from 'react-native-datatable-component'
import Cards from '../../components/Cards'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

const Employee = () => {

   const [items, setItems] = useState([])
   const [isLoading, setIsLoading] = useState(true)
   const navigation = useNavigation()

   useEffect(() => {
      fetch('http://10.0.2.2:81/api/employee')
         .then(res => res.json())
         .then((result) => {
            setItems(result)
            setIsLoading(false)
            // console.log(result)
         })
   }, [isLoading])
   { console.log('data' + data); }
   { console.log('items' + items); }

   const renderItem = ({ item }) => (
      <Pressable>
         <Divider my="2" />
         <Flex mx={2} direction="row">
            <Text flex={0.2}>{item.emp_id}</Text>
            <Divider orientation="vertical" mx="2" />
            <Text flex={0.2}>{item.fname}</Text>
            <Divider orientation="vertical" mx="2" />
            <Text flex={0.2}>{item.lname}</Text>
            <Divider orientation="vertical" mx="2" />
            <Text flex={0.2}>{item.nname}</Text>
            <Divider orientation="vertical" mx="2" />
            <Text flex={0.2}>{item.phone}</Text>
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

   let jsonString = '{"name": "John", "age": 30, "city": "New York"}';
   let obj = JSON.parse(jsonString);
   console.log(obj.name);

   return (
      <NativeBaseProvider>
         <Flex flexDir={'column'}>
            <HStack space={4} m={4}>
               <Cards color={'green.400'} text={'พนักงานประจำ'} heading={'10 คน'} />
               <Cards color={'amber.300'} text={'พนักงานชั่วคราว'} heading={'20 คน'} />
            </HStack>

            <HStack h={70} borderTopRadius={50} bgColor={'amber.300'} justifyContent={'space-around'} alignItems={'center'}>
               <Heading>รายชื่อพนักงาน</Heading>
               <IconButton colorScheme='success' variant={'solid'} borderRadius={25} Size={45} onPress={() => navigation.navigate('AddEmp')}>
                  <FontAwesomeIcon icon={faUserPlus} color={'white'} size={20} />
               </IconButton>
            </HStack>

            <Flex my={2} mx={2} direction="row" justify="space-evenly">
               <Text>Name</Text>
               <Divider orientation="vertical" mx="2" />
               <Text>Title</Text>
               <Divider orientation="vertical" mx="2" />
               <Text>Dept</Text>
               <Divider orientation="vertical" mx="2" />
               <Text>Score</Text>
            </Flex>
            <Box>
               <FlatList
                  data={items} renderItem={renderItem} keyExtractor={item => item.emp_id}
                  refreshing={isLoading} onRefresh={() => setIsLoading(true)} />
            </Box>
            <Box>
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

               {/* <Flex my={2} mx={2} direction="row" justify="space-evenly">
                  <Text>Name</Text>
                  <Divider orientation="vertical" mx="2" />
                  <Text>Title</Text>
                  <Divider orientation="vertical" mx="2" />
                  <Text>Dept</Text>
                  <Divider orientation="vertical" mx="2" />
                  <Text>Score</Text>
               </Flex>
               <Divider my="2" />
               <Flex mx={2} direction="row" justify="space-around">
                  <Text>Girls</Text>
                  <Text>Boys</Text>
                  <Text>Boys</Text>
                  <Text>Boys</Text>
               </Flex>
               <Divider orientation="horizontal" my="2" />
               <Flex mx={2} direction="row" justify="space-around">
                  <Text>Girls</Text>
                  <Text>Boys</Text>
                  <Text>Boys</Text>
                  <Text>Boys</Text>
               </Flex> */}

            </Box>
         </Flex>
      </NativeBaseProvider>
   )
}

export default Employee