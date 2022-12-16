import { faBorderTopLeft } from '@fortawesome/free-solid-svg-icons';
import { border } from 'native-base/lib/typescript/theme/styled-system';
import React from 'react';
import { ScrollView, View, Text, StyleSheet, FlatList } from 'react-native';

const MyScrollView = () => {
   return (
      <View style={styles.container}>
         <ScrollView>
            <View style={{ backgroundColor: 'red', padding: 50, margin: 10 }}></View>
            <View style={{ backgroundColor: 'red', padding: 50, margin: 10 }}></View>
            <View style={{ backgroundColor: 'red', padding: 50, margin: 10 }}></View>
            <View style={{ backgroundColor: 'red', padding: 50, margin: 10 }}></View>
            <View style={{ backgroundColor: 'red', padding: 50, margin: 10 }}></View>
            <View style={{ backgroundColor: 'red', padding: 50, marginVertical: 10 }}></View>
            <View style={{ backgroundColor: 'yellow', padding: 50, marginVertical: 10 }}></View>

         </ScrollView>
         <View style={styles.footer}>
            <Text style={styles.footerText}>This is the fixed footer</Text>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      // add styling for the content here
   },
   footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'blue',
      borderTopLeftRadius: 25
   },
   footerText: {
      // add styling for the footer text here
   },
});

export default MyScrollView;
