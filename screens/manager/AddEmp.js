import React, { useState, useEffect } from 'react'
import { NativeBaseProvider, Box, Text, Flex, FormControl, Input } from 'native-base'
import Header from '../../components/Header'

const AddEmp = () => {
   return (
      <NativeBaseProvider>
         <Header icon={'faUserPlus'} color={'lime.500'} title={'awdwadawdawd'} />
         <Flex flexDir={'column'}>
            {/* <FormControl isRequired>
               <FormControl.Label _text={{
                  bold: true
               }}>Name</FormControl.Label>
               <Input placeholder="John" onChangeText={value => setData({
                  ...formData,
                  name: value
               })} />
               <FormControl.HelperText _text={{
                  fontSize: 'xs'
               }}>
                  Name should contain atleast 3 character.
               </FormControl.HelperText>
               <FormControl.ErrorMessage _text={{
                  fontSize: 'xs'
               }}>
                  Error Name
               </FormControl.ErrorMessage>
            </FormControl> */}
         </Flex>
      </NativeBaseProvider>
   )
}

export default AddEmp