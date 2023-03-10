import React from 'react'
import { Heading, Text, VStack } from 'native-base'
import Icon from 'react-native-vector-icons/AntDesign'
import Icon2 from 'react-native-vector-icons/Ionicons'

const Modal = ({ mode, title, desc }) => {
   return (
      <VStack space={5} my={5} alignItems={'center'}>
         {mode === 'success' ? <Icon name={'checkcircleo'} color={'#22c55e'} size={90} /> :
            mode === 'invalid' ? <Icon name={'closecircleo'} color={'#dc2626'} size={90} /> :
               mode === 'warning' ? <Icon name={'exclamationcircleo'} color={'#fcd34d'} size={90} /> :
                  mode === 'waiting' ? <Icon2 name={'ios-timer-outline'} color={'#fcd34d'} size={100} /> :
                     mode === 'confirm' ? null : null}

         <Heading textAlign={'center'}>{title}</Heading>

         {!!desc ? <Text textAlign={'center'} fontSize={'md'}>{desc}</Text> : null}
      </VStack>
   )
}

export default Modal