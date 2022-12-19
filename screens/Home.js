import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, ScrollView, FlatList, Text, RefreshControl } from 'native-base';
import Footer from '../components/FooterEmp';
import Attendance from './employee/Attendance';
import Profile from './employee/Profile';

const Home = () => {

    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('http://10.0.2.2:81/api')
            .then(res => res.json())
            .then((result) => {
                setItems(result)
                setIsLoading(false)
                console.log(result)
                console.log(isLoading)
            })
    }, [isLoading])

    const renderItem = ({ item }) => (
        <Box flex={1} flexDir={'column'} bgColor={'amber.400'} mt={20} h={500}>
            <Text>{item.id}</Text>
            <Text>{item.username}</Text>
            <Text>{item.password}</Text>
        </Box>
    )

    return (
        <NativeBaseProvider>
            {/* <ScrollView refreshControl={<RefreshControl
                refreshing={isLoading}
                onRefresh={() => setIsLoading(true)} />
            }> */}
            {/* <ScrollView borderBottomWidth={1} borderBottomColor={'red.300'}> */}
            <Box bgColor={'blue.300'} m='10'>Hello world</Box>
            <Box bgColor={'blue.100'} m='10'>Hello world</Box>
            <FlatList
                data={items} renderItem={renderItem} keyExtractor={item => item.id}
                refreshing={isLoading} onRefresh={() => setIsLoading(true)} />
            <Box bgColor={'blue.100'} m='10'>Hello world</Box>
            <Box bgColor={'blue.100'} m='10'>Hello world</Box>
            {/* <Box h={100}>
                </Box>
                <Box bgColor={'blue.100'} m='10'>Hello world</Box>
                <Box bgColor={'blue.200'} m='10'>Hello world</Box>
                <Box bgColor={'blue.300'} m='10'>Hello world</Box> */}
            {/* </ScrollView> */}
        </NativeBaseProvider>
    )

}

export default Home