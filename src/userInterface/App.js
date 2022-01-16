import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import NewAccountScreen from './Views/ProfileScreens/NewAccountScreen';
import LoginScreen from './Views/ProfileScreens/LoginScreen';
import SongRecommendationScreen from './Views/SongRecs/SongRecommendationScreen';
import SongFinderScreen from './Views/SongRecs/SongFinderScreen';
import UserOptionScreen from './Views/ProfileScreens/UserOptionScreen'; 
import ProfileScreen from './Views/ProfileScreens/ProfileScreen';
import SearchUserNameScreen from './Views/SearchScreens/SearchUserNameScreen';
import UserReviewsScreen from './Views/ProfileScreens/UserReviewsScreen';
import SearchUserPrefScreen from './Views/SearchScreens/SearchUserPrefScreen';


/**
* This is the main class that will run each of the individual screens
*/
const Stack = createNativeStackNavigator();

/**
* Calls on each of the individual tscreens
* @returns the screens for each of the four tabs in the stack
*/
function MyTabs() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login Screen" component = {LoginScreen}/>
      <Stack.Screen name = "User Options Screen" component = {UserOptionScreen}/> 
      <Stack.Screen name= "New Account Screen" component= {NewAccountScreen} />
      <Stack.Screen name= "Song Finder Screen" component= {SongFinderScreen} />
      <Stack.Screen name= "Song Recommendation Screen" component= {SongRecommendationScreen} />
      <Stack.Screen name = "User Reviews Screen" component = {UserReviewsScreen} />
      <Stack.Screen name = "Search by Username Screen" component = {SearchUserNameScreen} /> 
      <Stack.Screen name = "Search by Preferences Screen" component = {SearchUserPrefScreen} />  
      <Stack.Screen name = "Profile Screen" component = {ProfileScreen} />
    </Stack.Navigator>
  );
}

/**
* Calls on the MyTabs function so that the app can navigate between the four screens
* @returns the a container to navigate between the sceens
*/
export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

