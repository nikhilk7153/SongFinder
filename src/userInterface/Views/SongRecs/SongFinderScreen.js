import React, { useState } from "react";
import {View, Text, Alert, TextInput, Button, ScrollView} from 'react-native';
import axios from 'axios';

/**
 * Class maintains the Bookmark preferences and song query page of the app
 */

/**
 * This screen will be reponsible for taking in user information for the type of artist, genre, and year that they want to enter.
 * If the user clicks the save bookmark button, their preferences will get saved. If the user clicks to see recommended songs, 
 * they will get pushed to another page. 
 */
const SongFinderScreen = ({navigation, route}) => {
    
    let userInfo = route.params.userInfo; 
    let username = route.params.username; 
    let preferences = userInfo["preferences"];

    const[genre, setGenre] = useState(preferences['genre']);
    const[artist, setArtist] = useState(preferences['artist']);
    const[year, setYear] = useState(preferences['year'].toString());
    
    let finalizedPref = {"genre": genre, "artist": artist, "year": year}

    return ( 
        <ScrollView> 
            <Text style = {{fontSize: 20, textAlign: 'center'}}> To obtain a list of recommended songs, please enter the following information: </Text>
            <Text></Text>
            <Text style = {{fontSize: 15, textAlign: 'center'}}> Genre: </Text>
            <TextInput
                    style={{height: 40, borderWidth: 2, margin: 20}}
                    value = {genre}
                    textAlign={'center'}
                    onChangeText={genre => setGenre(genre)}
                  />
            <Text></Text>
            <Text style = {{fontSize: 15, textAlign: 'center'}}> Artist Name: </Text>
            <TextInput
                    style={{height: 40, borderWidth: 2, margin: 20}}
                    value = {artist}
                    textAlign={'center'}
                    onChangeText={artist => setArtist(artist)}
                  />
            <Text></Text>
            <Text style = {{fontSize: 15, textAlign: 'center'}}> Year: </Text>
            <TextInput
                    style={{height: 40, borderWidth: 2, margin: 20}}
                    value = {year}
                    textAlign={'center'}
                    onChangeText={year => setYear(year)}
                  />
            <Text></Text>
            <View style={{ flexDirection:"row", justifyContent: "space-around"}}> 
              <Button title = "Save and reload page" onPress ={() => {updateUserBookmark(username, userInfo, finalizedPref, 
                'Song Finder Screen', {navigation, route})}}/>
              <Button title = "See Recommended Songs" onPress ={() => {toRecommendations(username, finalizedPref, {navigation, route})}}/>
            </View>
            <Text></Text>
            <Text></Text>
            <Button title = "Save and return to Profile Screen" titleStyle={{color: "white", fontSize: 8}} 
                onPress ={() => {updateUserBookmark(username, userInfo, finalizedPref, 
                'Profile Screen', {navigation, route})}}/>
        </ScrollView>
  );
}

/**
 * Function will update the bookmark information for a user 
 * @param username specfies the username for whom the bookmark will be updated 
 * @param preferences specifies the preferences for whom the preferences will be made
 */
function updateUserBookmark(username, userInfo, preferences, screenName, {navigation, route}) {
  
  userInfo["preferences"] = preferences
  
  axios.post('http://192.168.50.170:3000/updateUserInfo', {"username": username, "userInfo": userInfo})
  .then((res) => { 
    let preferences = res.data;
    if (isUserInputValid(userInfo["preferences"]["year"])) { 
      Alert.alert(
        "Bookmark update successful!",
        "         Click OK          ",
        [
          {text: "OK", onPress: () => {}}
        ]
      );
    }
    navigation.navigate(screenName, {"username":username, "userInfo": userInfo, "originalUser": username})
  }).catch((err) => { 
    console.log(err);
  });
}

/**
 * Function will send the output of the preferences to the song recommendations page if the user input is valid
 * @param username gives the user name of the 
 * @param preferences gives the preferences for the user for the song query
 */
function toRecommendations(username, preferences, {navigation, route}) {

  if (!isUserInputValid(preferences["year"])) { 
    navigation.navigate('Song Finder Screen', {"username":username, "preferences": preferences})
  } else { 
    axios.post('http://192.168.50.170:3000/querySong', {"preferences": preferences})
    .then((res) => { 
      navigation.navigate("Song Recommendation Screen", {"songList": res.data});
    }).catch((err) => { 
      console.log(err);
    });
  }
}

/**
 * Specifies whether or not the user input depending on the value for the year parameter
 * @param year gives the year of the 
 * @returns a boolean to specify whether or not 
 */
function isUserInputValid(year) { 
  if ((isNaN(year)) || ( !isNaN(year) && (parseInt(year) < 1949 || parseInt(year) > 2022)) ) {     
    Alert.alert(
      "Year value is not valid!",
      "Please enter an integer value greater than 1949 and less than 2022 to get the correct year",
      [
        {text: "OK", onPress: () => {}}
      ]
    );
    return false; 
  }
  return true; 
}

export default SongFinderScreen;