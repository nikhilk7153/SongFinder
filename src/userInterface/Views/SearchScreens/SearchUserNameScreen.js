import React, {useState, useEffect } from "react";
import {View, StyleSheet, Text, Alert, TextInput, Button, ScrollView} from 'react-native';
import axios from 'axios';

/**
 * Function provides a search screen for users to enter a username to search on and then returns a list of users from the query 
 * with the account usernames and a button to match or not 
 */
const SearchUserNameScreen = ({navigation, route}) => {
    
    const[query, setQuery] = useState('');
 
    let username = route.params.username; 
    let userInfo = route.params.userInfo; 

    if (!route.params.queryResult) { 
        return ( 
            <View> 
                <Text style = {{fontSize: 23, alignSelf: 'center'}}>Search by Username</Text>
                <Text></Text>
                <TextInput style={{height: 40, borderWidth: 2}} placeholder = "Please enter a user name" textAlign={'center'} 
                    onChangeText={query => setQuery(query)} />
                <Text></Text>
                <Text></Text>
                <Button  title = "Find Users" onPress = {() => {findUsersByUserID(username, userInfo, query, {navigation, route}); }} />
                <Text></Text>
            </View>
        );
    } else {
        
        let params = route.params.queryResult;
        let name = params["followName"];
        let followInfo = params["followInfo"];
        let followLabelList = params["follow_labels"];
        let followLabelDict = followLabelList[0];
        let followLabel = followLabelDict[name]; 
        let username = route.params.username;
        let userInfo = route.params.userInfo; 

        return (
            <View>
                <Text style = {{fontSize: 30, alignSelf: 'center'}}> List of User Profiles </Text>
                <Text></Text>
                <Text></Text>
                <View style={{ flexDirection:"row", justifyContent: "space-around"}}>
                <Text style = {{fontSize: 23}} onPress = {() => {navigation.navigate("Profile Screen", 
                            {"username": name, "userInfo": followInfo, "originalUser": username}); }} > {name} </Text>
                <Button title = {followLabel} onPress = {() => 
                        {updateFollowStatus(username, name, userInfo, followInfo, followLabel, {navigation, route})}}/>
                </View>
            </View>
        );
    } 
}

/**
 * Function returns the resulting account information from the user's search
 * @param {*} username is the username of the account that is performing the search
 * @param {*} userInfo is the username of the account 
 * @param {*} query is the username query that the username types 
 */
function findUsersByUserID(username, userInfo, query, {navigation, route}) { 
    axios.post('http://192.168.50.170:3000/findByUsername', {"username": username, "userInfo": userInfo, "userNameQuery": query})
    .then((res) => {
        console.log(res.data);
        navigation.navigate("Search by Username Screen", {"username": username, "userInfo": userInfo, "queryResult": {"followName": res.data["username"], "followInfo": res.data["userInfo"], "follow_labels": res.data["follow_labels"]}});
    })
    .catch((err) => {
       console.log(err);
    });
}

/**
 * Function will update the follow status to following upon a player clicking the button 
 * @param {*} username is the user's username that is performing the query
 * @param {*} followName is the username of the account being clicked
 * @param {*} userInfo is the information of the user 
 * @param {*} followInfo is the infomration of the individual being followed 
 * @param {*} followStatus is the status of whether the account is being followed by the user 
 */
function updateFollowStatus(username, followName, userInfo, followInfo, followStatus, {navigation, route}) { 

    if (followStatus === "Follow") { 
        axios.post('http://192.168.50.170:3000/updateFollowStatus', {"username": username, "followName": followName, "userInfo": userInfo, "followInfo": followInfo})
        .then((res) => {
            navigation.navigate("Search by Username Screen" , {"username": username, "userInfo": res.data, 
            "queryResult": {"followName": followName, "followInfo": followInfo, "follow_labels": res.data["follow_labels"]} });
        })
        .catch((err) => { 
            console.log(err);
        });
    }
}


export default SearchUserNameScreen; 