import React, { useState } from "react";
import {View, Text,  Button} from 'react-native';

/**
 * Function renders a list of buttons labelling which action a would be taking if they click on that button 
 */
const UserOptionScreen = ({route, navigation}) => {

    let username = route.params.username; 
    let userInfo = route.params.userInfo; 

    return (
        <View style = {{alignItems: 'center', justifyContent: 'center'}}>
            <Text style = {{fontSize: 25}} >Please click on a button to decide which action you would like to take </Text>
            <Text></Text>
            <Text></Text>
            <Text></Text> 
            <Button title = "View Profile" onPress ={() => {navigation.navigate("Profile Screen", {"username": username, "userInfo": userInfo, "originalUser": username})}} />
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Button title = "View Reviews" onPress ={() => {navigation.navigate("User Reviews Screen", {"username": username, "userInfo": userInfo})}}/>
            <Text></Text>
            <Text></Text>
            <Text></Text> 
            <Button title = "Find Users by Username" onPress ={() => {navigation.navigate("Search by Username Screen", {"username": username, "userInfo": userInfo})}}/>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Button title = "Find Users By Preferences" onPress ={() => {navigation.navigate("Search by Preferences Screen", {"username": username, "userInfo": userInfo})}}/>
            <Text></Text>
            <Text></Text>
            <Text></Text> 
            <Button title = "Find a song/Create Bookmark" onPress ={() => {navigation.navigate("Song Finder Screen", {"username": username, "userInfo": userInfo});}}/> 
        </View> 
    );
}

export default UserOptionScreen; 