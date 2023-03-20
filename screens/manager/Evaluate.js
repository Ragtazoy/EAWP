import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Flex, Text, VStack, HStack, Spinner, Heading, Divider, FlatList, Pressable, IconButton } from 'native-base'
import axios from 'axios';
import moment from 'moment';
import StarRating from 'react-native-star-rating';

import Header from '../../components/Header'

const Evaluate = ({ navigation }) => {
   const [items, setItems] = useState([])
   const [score, setScore] = useState(0)
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      (async () => {
         navigation.addListener('focus', () => setIsLoading(true))
         setItems([])

         axios.get('http://10.0.2.2:81/read/evaluate', {
            params: { evaluate_date: moment().subtract(1, 'M').set('date', 1).format('YYYY-MM-DD') }
         }).then((res) => {
            if (res.data.length !== 0) {
               setItems(res.data)

               const sum = res.data.reduce((accumulator, val) => {
                  return accumulator + val.score;
               }, 0);

               const meanScore = sum / res.data.length;
               setScore(meanScore)
            }
            setIsLoading(false)
         })
      })()
   }, [isLoading])

   const renderItem = ({ item }) => (
      <Pressable onPress={() => { navigation.navigate('EvaluateDetail', { id: item.emp_id }) }} bgColor={'white'}>
         <Divider />
         <Flex my={2} direction="row" alignItems={'center'}>
            <Box flex={0.25}>
               <Text alignSelf={'center'}>{item.nname}</Text>
            </Box>
            <Box flex={0.25}>
               <Text alignSelf={'center'}>{item.job_title}</Text>
            </Box>
            <Box flex={0.25}>
               <Text alignSelf={'center'}>{item.dept}</Text>
            </Box>
            <Box flex={0.25}>
               <Text alignSelf={'center'}>{item.score}</Text>
            </Box>
         </Flex>
      </Pressable>
   )

   return (
      <NativeBaseProvider>
         <Header mode={'text'} title={'ประเมินพนักงาน'} subtitle={'ประเมินพนักงานรายเดือน'} />

         <VStack flex={1}>
            {!isLoading ? (
               <Box bgColor={'#7c2d12'} m={5} px={4} py={6} borderRadius={25} >
                  <Heading mb={3} fontSize={'lg'} color={'white'}>คะแนนเฉลี่ยเดือน {moment().subtract(1, 'M').format('MMMM YYYY')}</Heading>

                  {score === 0 ? <Heading textAlign={'center'} color={'warning.300'}>ไม่มีข้อมูล</Heading> : (
                     <HStack mx={2} justifyContent={'space-between'} alignItems={'center'}>
                        <Heading mr={5} color={'amber.300'} fontSize={'3xl'}>{score}</Heading>
                        <Box flex={1}>
                           <StarRating
                              disabled={true}
                              emptyStar={'star-o'} fullStar={'star'} halfStar={'star-half-o'}
                              iconSet={'FontAwesome'}
                              maxStars={5}
                              rating={score}
                              fullStarColor={'#fcd34d'}
                              emptyStarColor={'#fcd34d'}
                           />
                        </Box>
                     </HStack>
                  )}
               </Box>
            ) : (
               <HStack my={16} space={2} justifyContent="center" alignItems={'center'}>
                  <Spinner accessibilityLabel="Loading" color={'#7c2d12'} />
                  <Heading color="#7c2d12" fontSize="md">
                     กำลังโหลดข้อมูล
                  </Heading>
               </HStack>
            )}

            <HStack h={60} borderTopRadius={50} shadow={1} justifyContent={'space-around'} alignItems={'center'} bgColor={'white'}>
               <Heading>รายชื่อพนักงาน</Heading>
               {/* <IconButton colorScheme='amber' variant={'solid'} borderRadius={25} Size={45} onPress={() => null}>
                  <Icon name="sort-descending" size={22} color="white" />
                  <Icon name="sort-ascending" size={22} color="white" />
               </IconButton> */}
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
               <Box flex={0.25}>
                  <Text alignSelf={'center'} color={'white'}>แผนก</Text>
               </Box>
               <Divider orientation="vertical" mx="1" />
               <Box flex={0.25}>
                  <Text alignSelf={'center'} color={'white'}>คะแนน</Text>
               </Box>
            </HStack>

            <FlatList
               data={items} renderItem={renderItem} keyExtractor={item => item.emp_id}
               refreshing={isLoading} onRefresh={() => setIsLoading(true)} />

         </VStack>

      </NativeBaseProvider>
   )
}

export default Evaluate