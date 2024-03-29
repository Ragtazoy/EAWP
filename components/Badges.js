import React from 'react'
import { Badge, Box, Text } from 'native-base'

const Badges = ({ status, color, text }) => {
   const handleStatus = (status) => {
      switch (status) {
         case 'attended': return (
            <Badge bgColor={'#16a34a' + '30'} borderRadius={'full'} leftIcon={<Box p={1} borderRadius={'full'} bgColor={'#16a34a'}></Box>}>
               <Text fontWeight={'semibold'} color={'#16a34a'}>เข้างาน</Text>
            </Badge>
         )
         case 'absent': return (
            <Badge bgColor={'#dc2626' + '30'} fil borderRadius={'full'} leftIcon={<Box p={1} borderRadius={'full'} bgColor={'#dc2626'}></Box>}>
               <Text fontWeight={'semibold'} color={'#dc2626'}>ขาดงาน</Text>
            </Badge>
         )
         case 'leave': return (
            <Badge bgColor={'#a3a3a3' + '30'} fil borderRadius={'full'} leftIcon={<Box p={1} borderRadius={'full'} bgColor={'#a3a3a3'}></Box>}>
               <Text fontWeight={'semibold'} color={'#a3a3a3'}>ลางาน</Text>
            </Badge>
         )
         case 'late': return (
            <Badge bgColor={'#fbbf24' + '30'} fil borderRadius={'full'} leftIcon={<Box p={1} borderRadius={'full'} bgColor={'#fbbf24'}></Box>}>
               <Text fontWeight={'semibold'} color={'#fbbf24'}>สาย</Text>
            </Badge>

         )
         default: return <Box></Box>
      }
   }

   return (
      handleStatus(status)
   )
}

export default Badges