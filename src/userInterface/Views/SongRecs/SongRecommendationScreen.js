import React, { useState } from "react";
import {View, StyleSheet, Text, FlatList, Linking} from 'react-native';

/**
 * Class maintains the screen for showing the results of matching songs based on the user's query
 */

/**
 * The purpose of this function is to provide the Song Recommendations to the user based on their query. 
 * The route parameter will contain the list of json objects of matching queries which will get rendered onto the screen. 
 */
const SongRecommendationScreen = ({route, navigation}) => { 

    let songList = route.params.songList

    if (songList.length == 0) { 
        return ( 
            <View>
                 <Text style = {{fontSize: 30, textAlign: 'center'}}> List of Recommended Songs </Text> 
                 <Text> </Text>
                 <Text> </Text>
                 <Text style = {{fontSize: 23, textAlign: 'center'}}> No songs found </Text> 
            </View>
        );
    } else {
        return (
            <View>
                <Text style = {{fontSize: 30, textAlign: 'center'}}> List of Recommended Songs </Text> 
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <FlatList data = {songList}
                    renderItem={({item}) => <>
                                    <Text style = {{fontSize: 25, textAlign: 'center'}} > {item.song_title} </Text>
                                    <Text></Text>
                                    <Text> Band: {item.artist} </Text>
                                    <Text></Text>
                                    <Text> Genre: {item.genre} </Text>
                                    <Text></Text>
                                    <Text> Year: {item.year} </Text>
                                    <Text></Text>
                                    <Text> Song Length: {item.song_length} </Text>
                                    <Text></Text>
                                    <Text style = {{color: "blue"}} onPress={() => Linking.openURL(item.info_link)} > Click here for more info </Text>
                                    <Text></Text>
                                    <Text></Text>
                                    </>
                    }
                    keyExtractor={(item) => {return item.song_title}}
                />
            </View>
        );
    }
}

export default SongRecommendationScreen;
