import React, {useState, useEffect } from "react";
import {View, SafeAreaView, Text, Alert, TextInput, Button, ScrollView, FlatList, LogBox} from 'react-native';
import axios from 'axios';

LogBox.ignoreAllLogs();

/**
* Class is meant to maintain the screen for user reviews 
*/

/**
 * Function renders the reviews screen by displaying the list of reviews as presented by the user. The update and delete button are present
 * for each review along with a search box for a user to find a specific review/insert a new review. 
 */

const UserReviewsScreen = ({navigation, route}) => {

    const[songTitle, setSongTitle] = useState('');
    const[review, setReview] = useState(''); 
    const[rating, setRating] = useState(''); 

    let username = route.params.username; 
    let userInfo = route.params.userInfo; 
    let review_data = {"songTitle": songTitle, "review": review, "rating": rating}; 

    return ( 
        <ScrollView>
            <Text style = {{fontSize: 23, textAlign: 'center'}}> Add/Edit a Review </Text>
            <Text></Text>
            <Text style= {{textAlign: 'center'}} > Song Title: </Text>
            <TextInput
                    style={{height: 40, borderWidth: 2, margin: 20}}
                    value = {songTitle}
                    textAlign={'center'}
                    onChangeText={songTitle => setSongTitle(songTitle)}
                  />
            <Text style= {{textAlign: 'center'}}> Rating (Between 0.0 and 5.0): </Text>
            <TextInput
                    style={{height: 40, borderWidth: 2, margin: 20}}
                    value = {rating}
                    textAlign={'center'}
                    onChangeText={rating => setRating(rating)}
                  />
            <Text style= {{textAlign: 'center'}}> Review: </Text>
            <TextInput
                    style={{height: 100, borderWidth: 2, margin: 20}}
                    value = {review}
                    textAlignVertical = {'top'}
                    onChangeText={review => setReview(review)}
                  />
            <Text></Text>
            <Text></Text>
            <View style={{ flexDirection:"row", justifyContent: "space-around"}}> 
                        <Button title = "Edit/Insert" onPress ={() => {sendInfo(username, userInfo, review_data, {navigation, route})}} />
                        <Button title = "Search" onPress ={() => {searchSong(username, userInfo, review_data, {navigation, route})}} />
            </View>
            <Text></Text>
            <Text></Text>
            <Text style = {{fontSize: 25, textAlign: "center"}}> List of User Song Reviews </Text>
            <Text></Text>
            <Text></Text>
            <SafeAreaView>
            <FlatList nestedScrollEnabled={true} 
                    data = {userInfo["reviews"]}
                    renderItem={({item}) => <>
                                    <Text style = {{fontSize: 25, textAlign: 'center'}} > {item.songTitle} </Text>
                                    <Text></Text>
                                    <Text style = {{fontSize: 20}}> Rating: {item.rating} </Text>
                                    <Text></Text>
                                    <Text style = {{fontSize: 20}}> Review: {item.review} </Text>
                                    <Text></Text>
                                    <Text></Text>
                                    <View style={{ flexDirection:"row", justifyContent: "space-around"}}> 
                                        <Button title = "Delete" onPress ={() => {deleteSongReview(username, item.songTitle, userInfo, {navigation, route})}} />
                                        <Button title = "Update" onPress ={() => {setRating(item.rating); setReview(item.review); setSongTitle(item.songTitle);}} />
                                    </View>
                                    <Text></Text>
                                    <Text></Text>
                                    </>
                    }
                    keyExtractor={(item) => {return item.songTitle}}
                />
            </SafeAreaView>
        </ScrollView>
    );
}

/**
 * Function used for updating/inserting information and then re-rendering the screen
 * @param {*} username is the username of the user 
 * @param {*} userInfo is the account information of the user 
 * @param {*} review_data is the information inputted into the search box 
 */

function sendInfo(username, userInfo, review_data, {navigation, route}) { 
    axios.post(`http://192.168.50.170:3000/modifyReviewList`, {"username": username, "userInfo": userInfo, "review": review_data})
    .then((res) => {    
        if (res.status === 200) { 
            Alert.alert(
                "Modification successful",
                "Press OK to to go back to your review screen",
                [
                  {text: "OK", onPress: () => {navigation.navigate("User Reviews Screen", {"username": username, "userInfo": res.data})}}
                ]
              );
        }
    }).catch((error) => {
        Alert.alert(
            "Invalid User Input",
            "Please check that the title is not empty and the rating is a valid value",
            [
              {text: "OK", onPress: () => {}}
            ]
        );
    });
}

/**
 * Function is used for sending the song information for the song that should be deleted and then displaying the screen with the deletion intact 
 * @param {*} username is the username for the user 
 * @param {*} songTitle is the name of the song title for which the review will be deleted 
 * @param {*} userInfo is the account information of the user performing the search 
 */

function deleteSongReview(username, songTitle, userInfo, {navigation, route}) { 
    axios.post(`http://192.168.50.170:3000/deleteSongReview`, {"username": username, "songTitle": songTitle, "userInfo": userInfo})
    .then((res) => {    
        if (res.status === 200) { 
            Alert.alert(
                "Deletion successful",
                "Press OK to to go back to your review screen",
                [
                  {text: "OK", onPress: () => {navigation.navigate("User Reviews Screen", {"username": username, "userInfo": res.data})}}
                ]
            );
        }
    }).catch((error) => {
        console.log(error);
    });
}

/**
 * Function will query for a song based on the information passed in in the search boxes and return the screen with the query results 
 * @param {*} username is the username of account that is perfoming the search
 * @param {*} userInfo is the account information of the user perfoming the search
 * @param {*} review_data is the information that is being passed in for the search
 */

function searchSong(username, userInfo, review_data, {navigation, route}) { 
    axios.post(`http://192.168.50.170:3000/findSong`,  {"username": username, "userInfo": userInfo, "review": review_data})
    .then((res) => { 
        navigation.navigate("User Reviews Screen", {"username": username, "userInfo": res.data})
    })
    .catch((error) => {
        Alert.alert(
            "Invalid User Input",
            "Please check that the title is not empty and the rating is a valid value",
            [
              {text: "OK", onPress: () => {}}
            ]
        ); 
    });
}

export default UserReviewsScreen; 