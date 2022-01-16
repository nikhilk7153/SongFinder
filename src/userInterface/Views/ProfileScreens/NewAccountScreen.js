import React, {useState, useEffect } from "react";
import {View, StyleSheet, Text, Alert, TextInput, Button, ScrollView} from 'react-native';
import axios from 'axios';

/**
 * File maintains the new account screen of the app 
 */

/**
 * Function renders the form for creating a new account and allows a user to create an account upon clicking the create account button, 
 * or go back to the login page. 
 */
const NewAccountScreen = ({route, navigation}) => {

     const[username, setUserName] = useState('');
     const[password, setPassword] = useState('');

    return(
        <ScrollView>
            <Text style = {{fontSize: 25, textAlign: 'center'}}> To create your account, please enter a username and a password </Text>
            <Text></Text>
            <Text></Text>
            <Text onPress = {() => {navigation.navigate("Login Screen")}} style = {{fontWeight: 'bold', textAlign: 'center'}}>
                Click here to go back to the login page </Text>
            <Text></Text>
            <Text></Text>
            <Text style = {{fontSize: 23}}>Username: </Text>
            <TextInput
                    style={{height: 40, borderWidth: 2, margin: 20}}
                    placeholder="     Enter your user name here   "
                    onChangeText={username => setUserName(username)}
                  />
            <Text></Text>
            <Text></Text>
            <Text style = {{fontSize: 23}}>Password: </Text>
            <TextInput
                    style={{height: 40, borderWidth: 2, margin: 20}}
                    placeholder= "       Enter your password here"
                    onChangeText={password => setPassword(password)}
                    secureTextEntry = {true}
                  />
            <Text> </Text>
            <Text> </Text>
            <Button title = "Create my Account" onPress ={() => {insertUserName(username, password,
             {route, navigation})}} />
        </ScrollView>
    );
}

/**
 * This function will validate the user input and add the user to the MongoDB database. The user will get sent to song preference screen,
 * if their input is valid. 
 * @param username the username that the user has inputted into the form 
 * @param password the password that the user has inputted into the form 
 */
function insertUserName(username, password, {route, navigation}) {
    axios.post(`http://192.168.50.170:3000/addUserLogin`, {"username": username, "password": password})
    .then((resp) => {
       if (resp.status === 200) {
            Alert.alert(
              "Your account has been successfully created",
              "You will now be directed to the User Options Screen to select your next action",
              [
                {text: "OK", onPress: () => {navigation.navigate("User Options Screen", {"username": username, "userInfo": resp.data})}}
              ]
            );
       } 
    }).catch(() => {
        Alert.alert(
            "The user name that you have entered is already being used by another individual",
            "Please click OK and enter a different user name",
            [
              {text: "OK", onPress: () => {}}
            ]
      );
    });
}

export default NewAccountScreen;