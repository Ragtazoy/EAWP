import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, ScrollView, Text, VStack, Button } from 'native-base'
import Header from '../../components/Header'

const Report = ({ navigation }) => {
   return (
      <NativeBaseProvider>
         <Header mode={'text'} title={'รายงาน'} subtitle={'ประวัติการจ่ายค่าจ้างและสถิติขาด/ลา/มาสาย'} />
         <VStack flex={1} py={10} alignItems={'center'} space={10}>
            <Button onPress={() => { navigation.navigate('ReportWage') }} flex={0.5} w={'80%'} borderRadius={'3xl'}>
               <Text>ReportWage</Text>
            </Button>
            <Button onPress={() => { navigation.navigate('ReportAttend') }} flex={0.5} w={'80%'} borderRadius={'3xl'}>
               <Text>ReportAttend</Text>
            </Button>

            {/* <Pressable>
               <Box flex={0.5} bgColor={'red.300'}>
                  <Text>awd</Text>
               </Box>
            </Pressable>
            <Pressable>
               <Box flex={0.5} bgColor={'red.300'}>
                  <Text>awd</Text>
               </Box>
            </Pressable> */}
         </VStack>
      </NativeBaseProvider>
   )
}

export default Report