import React, {useState, useEffect } from "react";
import {View, StyleSheet, Text, Alert, TextInput, Button, ScrollView, Image, TouchableOpacity} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

/**
 * Class maintains the Profile screen of the app 
 */

/**
 * Function renders the profile screen with their image and bookmark preferences. 
 * Buttons allows the user to insert a profile image and update their bookmark preferences. 
 * Referenced ImagePicker documentation code to for pickImage() function (https://docs.expo.dev/versions/latest/sdk/imagepicker/)
 */
const ProfileScreen = ({navigation, route}) => { 

    let username = route.params.username; 
    let userInfo = route.params.userInfo;
    let preferences =  userInfo["preferences"];

    async function pickImage () {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
          userInfo["image"] = result.uri;
          saveImage(username, userInfo, result.uri, {navigation,route}); 
      }
    };
    
    return ( 
        <View style = {{alignItems: 'center'}}> 
            <Text style = {{fontSize: 30, textAlign: 'center'}}> Profile of {username} </Text>
            <TouchableOpacity onPress={() =>  { 
                                              if (route.params.originalUser === username) {
                                                pickImage();
                                              }
                                            }
                                              }>
              <Image source={{ uri: userInfo["image"]}} style={{ width: 150, height: 150, alignItems: 'center'}} /> 
            </TouchableOpacity>   
            <Text> Click the profile picture upload an image </Text>
            <Text></Text>
            <View style={{ flexDirection:"row", justifyContent: "space-around"}}> 
                <Text style = {{fontSize: 22}}>Followers: {userInfo["followers"].length} </Text>
                <Text> {'                  '} </Text>
                <Text style = {{fontSize: 22}}>Following: {userInfo["following"].length} </Text>
            </View>
            <Text></Text>
            <Text></Text>
            <Text style = {{fontSize: 25 , textAlign: 'center'}}> Song Preferences </Text>
            <Text></Text>
            <Text style = {{fontSize: 18, alignItems: 'flex-start'}}> Favorite Genre: {preferences["genre"]} </Text>
            <Text></Text>
            <Text style = {{fontSize: 18}}> Favorite Artist: {preferences["artist"]}</Text>
            <Text></Text>
            <Text style = {{fontSize: 18}}> Favorite Year: {preferences["year"]}</Text>
            <Text></Text>
            <Text></Text>
            {(route.params.originalUser === username) && <Button title = "Update Song Preferences" onPress={() => {navigation.navigate('Song Finder Screen', {"username": username, "userInfo": userInfo})}} /> }
        </View>
    );
}

/**
 * Function saves/updates a new image for the user upon insertion by adding it to the MongoDB database and then calling the function again
 * @param {*} username is the username of the user performing the image insertion
 * @param {*} userInfo is the user's account information 
 * @param {*} newImage is the image that will be inserted 
 */

function saveImage(username, userInfo, newImage, {navigation, route}) { 
    axios.post('http://192.168.50.170:3000/uploadUserImage', {"username": username, "userInfo": userInfo, "newImage": newImage})
    .then((res) => {
        if (res.status === 200) {
            Alert.alert(
                "Image upload successfull!",
                "         Click OK          ",
                [
                  {text: "OK", onPress: () => {}}
                ]
              ); 
        }
        navigation.navigate("Profile Screen", {"username": username, "userInfo": res.data, "originalUser": username});
    }).catch((err) => { 
        Alert.alert(
            "There appears to be an error when uploading the image.",
            "Please restart the app and upload a valid image. ",
            [
              {text: "OK", onPress: () => {navigation.navigate("Profile Screen", {"username": username, "userInfo": res.data});}}
            ]
          ); 
    });
}


export default ProfileScreen; 