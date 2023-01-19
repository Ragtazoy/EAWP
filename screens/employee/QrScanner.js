import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Fab } from 'native-base';
import { useCameraDevices } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';
import moment from 'moment';

import Icon from 'react-native-vector-icons/Feather'
import AwesomeAlert from 'react-native-awesome-alerts'
import Modal from '../../components/Modal';

export default function QrScanner2({ route, navigation }) {
   const { id, sched_id } = route.params
   const [showAlert, setShowAlert] = useState(false)

   const [isActive, setIsActive] = useState(true);
   const [hasPermission, setHasPermission] = useState(false);
   const devices = useCameraDevices();
   const device = devices.back;

   const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
      checkInverted: true,
   });

   useEffect(() => {
      (async () => {
         console.log(id, sched_id)
         const status = await Camera.requestCameraPermission();
         setHasPermission(status === 'authorized');
      })()
   }, []);

   useEffect(() => {
      if (barcodes && barcodes.length > 0) {
         checkBarcode()
      }
   }, [barcodes]);

   const checkBarcode = async () => {
      setIsActive(false)
      const qrCode = await barcodes[0].displayValue
      console.log(qrCode)
      const objQrCode = await JSON.parse(qrCode)
      await Geolocation.getCurrentPosition(
         position => {
            const distance = getDistance(
               position.coords,
               objQrCode
            )
            distance < 100 ? checkIn() : setShowAlert(true)
         },
         error => Alert.alert(error.message),
         { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      )
   };

   const checkIn = async () => {
      console.log('check in');
      const time_in = await moment()
      const time_fix = await moment().hours(16).minutes(0).seconds(0)
      let status
      if (time_in <= time_fix) {
         status = 'attended'
      } else {
         status = 'late'
      }

      console.log(time_in.format('YYYY-MM-DD HH:mm:ss'), status, id, sched_id);
      await axios.post('http://10.0.2.2:81/create/work_attendance', {
         time_in: time_in,
         status: status,
         emp_id: id,
         sched_id: sched_id
      }).then(() => {
         console.log('post /create/work_attendance already')
      })
   };

   const handleBack = async () => {
      await setIsActive(false)
      navigation.goBack()
   };

   return (
      device != null &&
      hasPermission && (
         <NativeBaseProvider>
            <Fab renderInPortal={false} colorScheme={'amber'} shadow={2} boxSize={16} placement="top-left"
               icon={<Icon color="white" name="x" size={30} />} onPress={handleBack} />
            <Fab renderInPortal={false} colorScheme={'amber'} shadow={2} boxSize={16} placement="top-right"
               icon={<Icon color="white" name="x" size={30} />} onPress={handleBack} />
            <Camera
               style={{ flex: 1 }}
               device={device}
               isActive={isActive}
               frameProcessor={frameProcessor}
               frameProcessorFps={5}
            />

            <AwesomeAlert
               show={showAlert}
               customView={<Modal mode={'invalid'} title={'คุณอยู่ห่างจากร้านเกินไป'} />}
               contentContainerStyle={{ width: '80%' }}
               onDismiss={() => { navigation.navigate('AttendanceEmp') }}
            />
         </NativeBaseProvider>
      )
   );
}