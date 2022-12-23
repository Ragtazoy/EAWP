import React from 'react'
import { NativeBaseProvider, Box, Heading, Text, VStack } from 'native-base'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckCircle, faHourglassHalf } from '@fortawesome/free-regular-svg-icons'

const Modal = ({ mode, title, desc }) => {
   return (
      <VStack space={5} my={5} alignItems={'center'}>
         {mode === 'success' ? <FontAwesomeIcon icon={faCheckCircle} color={'#22c55e'} size={'90'} /> :
            <FontAwesomeIcon icon={faHourglassHalf} color={'#fcd34d'} size={'80'} />}
         <Heading>{title}</Heading>
         {!!desc ? <Text fontSize={'md'}>{desc}</Text> : null}
      </VStack>
   )
}

export default Modal