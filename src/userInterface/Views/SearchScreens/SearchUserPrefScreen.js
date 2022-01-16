import React, {useState, useEffect } from "react";
import {View, StyleSheet, Text, Alert, TextInput, Button, ScrollView, FlatList} from 'react-native';
import axios from 'axios';

/**
 * Responsible for mainting the screen for searching by song preferences
 */

/**
 * Function initially renders the screen for showing the query preference for the username. 
 */
const SearchUserPrefScreen=({navigation, route}) => { 

    const[artist, setArtist] = useState('');
    const[genre, setGenre] = useState('');
    const[year, setYear] = useState('');

    let username = route.params.username; 
    let userInfo = route.params.userInfo; 

    let query = {"artist": artist, "genre": genre, "year": year}; 

    if (!route.params.queryResult) { 
        return (
            <View> 
                <Text style = {{fontSize: 23, alignSelf: 'center'}}>Search by Bookmark Preferences</Text>
                <Text></Text>
                <TextInput style={{height: 40, borderWidth: 2}} placeholder = "Please enter year value" textAlign={'center'} 
                    onChangeText={year => setYear(year)} />
                <Text></Text>
                <TextInput style={{height: 40, borderWidth: 2}} placeholder = "Please enter an artist/band name" textAlign={'center'} 
                    onChangeText={artist => setArtist(artist)} />
                <Text></Text>
                <TextInput style={{height: 40, borderWidth: 2}} placeholder = "Please enter a genre" textAlign={'center'} 
                    onChangeText={genre => setGenre(genre)} />
                <Text></Text>
                <Button  title = "Find Users" onPress = {() => {findUsersByQuery(username, userInfo, query, {navigation, route}); }} />
                <Text></Text>
            </View>
        );
    } else { 
       
        let userList = route.params.queryResult;
        let username = route.params.username; 
        let userInfo = route.params.userInfo;
        
        return (
            <View>
                <Text style = {{fontSize: 30, alignSelf: 'center'}}> List of User Profiles </Text>
                <Text></Text>
                <Text></Text>
                <FlatList data = {userList}
                    renderItem={({item}) => <>
                                            <Text></Text>
                                            <View style={{ flexDirection:"row", justifyContent: "space-around"}}>
                                                <Text style = {{fontSize: 23}} onPress = {() => {navigation.navigate("Profile Screen", 
                                                            {"username": item.name, "userInfo": item.profileInfo, "originalUser": username}); }}> {item.name} </Text>
                                                <Button title = {item.follow_type} onPress = {() => 
                                                        {updateFollowStatus(username, item.name, userInfo, item.profileInfo, item.follow_type, userList, {navigation, route})}
                                                        }/>
                                            </View>
                                            <Text></Text>
                                            </>
                            }
                    keyExtractor={(item) => {return item.name}}
              />
            </View>
        );
    }
}

/**
 * Function returns the resulting account information from the user's search based on song preferences
 * @param {*} username is the username of the account that is performing the search
 * @param {*} userInfo is the username of the account 
 * @param {*} query is the query as specified by the user's input in the song preference boxes 
 */
function findUsersByQuery(username, userInfo, query, {navigation, route}) {
   
    axios.post('http://192.168.50.170:3000/findByBookmarkPref', {"username": username, "userInfo": userInfo, "queryPref": query})
    .then((res) => { 
        navigation.navigate("Search by Preferences Screen", {"username": username, "userInfo": userInfo, "queryResult": res.data["follow_labels"]});
    })
    .catch((err) => { 
       console.log(err);
    });
}

/**
 * Function will update the follow status to following upon a player clicking the button and re-render the whole page 
 * @param {*} username is the user's username that is performing the query
 * @param {*} followName is the username of the account being clicked
 * @param {*} userInfo is the information of the user 
 * @param {*} followInfo is the infomration of the individual being followed 
 * @param {*} followStatus is the status of whether the account is being followed by the user 
 */
function updateFollowStatus(username, followName, userInfo, followInfo, followStatus, userList, {navigation, route}) { 
    if (followStatus === "Follow") { 
        axios.post('http://192.168.50.170:3000/updateFollowStatus', {"username": username, "followName": followName, "userInfo": userInfo, "followInfo": followInfo, "userList": userList})
        .then((res) => { 
            navigation.navigate("Search by Preferences Screen" , {"username": username, "userInfo": userInfo, 
            "queryResult": res.data["follow_labels"]} );
        })
        .catch((err) => { 
            console.log(err);
        });
    }
}

export default SearchUserPrefScreen;