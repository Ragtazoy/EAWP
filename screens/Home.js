import React from 'react';
import { NativeBaseProvider, Box, ScrollView } from 'native-base';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <NativeBaseProvider>
            <ScrollView>
                <Box bgColor={'blue.100'} m='10'>Hello world</Box>
                <Box bgColor={'blue.100'} m='10'>Hello world</Box>
                <Box bgColor={'blue.100'} m='10'>Hello world</Box>
                <Box bgColor={'blue.100'} m='10'>Hello world</Box>
                <Box bgColor={'blue.100'} m='10'>Hello world</Box>
                <Box bgColor={'blue.100'} m='10'>Hello world</Box>
                <Box bgColor={'blue.100'} m='10'>Hello world</Box>
                <Box bgColor={'green.100'} h='10'>Hello world</Box>
            </ScrollView>
            <Footer />
        </NativeBaseProvider>
    )
}

export default Home