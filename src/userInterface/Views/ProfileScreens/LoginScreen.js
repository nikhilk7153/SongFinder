import React, {useState, useEffect } from "react";
import {View, StyleSheet, Text, Alert, TextInput, Button, ScrollView} from 'react-native';
import axios from 'axios';

/**
 * File maintains the login page of the app 
 */

/**
 * Functions renders the form for the user to login. Specifically, this page will allow a user 
 */
const LoginScreen = ({route, navigation}) => {

     const[username, setUserName] = useState('');
     const[password, setPassword] = useState('');

    return(
        <ScrollView>
            <Text style = {{fontSize: 30, textAlign: 'center'}}> Welcome to SongFinder! </Text>
            <Text></Text>
            <Text></Text>
            <Text style = {{fontSize: 25, textAlign: 'center'}}> Please enter your Login Information </Text>
            <Text></Text>
            <Text></Text>
            <Text onPress = {() => {navigation.navigate("New Account Screen")}} style = {{fontWeight: 'bold', textAlign: 'center'}}>
                Click here to make new account </Text>
            <Text></Text>
            <Text></Text>
            <Text style = {{fontSize: 23, textAlign: 'center'}}>Username: </Text>
            <TextInput
                    style={{height: 40, borderWidth: 2, margin: 20}}
                    placeholder="     Enter your user name here   "
                    onChangeText={username => setUserName(username)}
                  />
            <Text></Text>
            <Text></Text>
            <Text style = {{fontSize: 23, textAlign: 'center'}}>Password: </Text>
            <TextInput
                    style={{height: 40, borderWidth: 2, margin: 20}}
                    placeholder= "       Enter your password here"
                    onChangeText={password => setPassword(password)}
                    secureTextEntry = {true}
                  />
            <Text> </Text>
            <Text> </Text>
            <Button title = "Login" onPress ={() => {findUser(username, password,
             {route, navigation})}} />
        </ScrollView>
    );
}


/**
 * Function will validate the user's input, and if valid, the user will get sent to the song preference page. If not, the user will 
 * get sent an alert indicating their username or password is not recognized by the database. 
 * @param username is the username that the user has inputted
 * @param password is the password that the user has inputted 
 */
function findUser(username, password, {route, navigation}) {
    axios.post(`http://192.168.50.170:3000/findUserLogin`, {"username": username, "password": password})
    .then((res) => {
        navigation.navigate("User Options Screen", {"username": username, "userInfo": res.data})
    }).catch((error) => {
        Alert.alert(
            "Invalid username or password",
            "Please double check that you have entered the above information correctly. If you have ",
            [
              {text: "OK", onPress: () => {}}
            ]
       );
    });
}


export default LoginScreen;