import React from 'react';
import renderer from 'react-test-renderer';
import SearchUserNameScreen from '../Views/SearchScreens/SearchUserNameScreen';
import SearchUserPrefScreen from '../Views/SearchScreens/SearchUserPrefScreen';
import ProfileScreen from '../Views/ProfileScreens/ProfileScreen';

/**
 * Mock test to check if the views for the search screen and profile screen is proper
 */

// test for user name search screen before the search button is clicked 
test('renders profile screen properly', () => {
    const tree = renderer.create(
        <ProfileScreen route = {{params: {username: "john", userInfo: {
                                followers: [],
                                following: [],
                                image: "https://www.shareicon.net/data/512x512/2016/08/18/809259_user_512x512.png",
                                preferences: {
                                    genre: "Rock",
                                    artist: "The Cure",
                                    year: "1980"
                                }, 
                            reviews: []
                        },
                    }
         }}/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

// test for user name search screen before the search button is clicked 
test('renders search user name screen before search correctly', () => {
    const tree = renderer.create(
        <SearchUserNameScreen route = {{params: {username: "nikhil", userInfo: "" } }} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

// test for user preference search screen before the search button is clicked 
test('renders search user preferences screen before search correctly', () => {
    const tree = renderer.create(
        <SearchUserPrefScreen route = {{params: {username: "nikhil", userInfo: "" } }} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

// test for user name search screen after the search button is clicked 
test('renders search user search screen after clicking search', () => {
    const tree = renderer.create(
        <SearchUserNameScreen  route = {{params: {username: "nikhil", userInfo: "", queryResult:  {
            followName: "john", followInfo: "", follow_labels: [{"john": "Follow"}]}}}}/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

// test for user preference search screen after the search button is clicked 
test('renders search user preferences results after clicking search', () => {
    const tree = renderer.create(
        <SearchUserPrefScreen route = {{params: {username: "nikhil", userInfo: "", queryResult:  {
            username: "john", followInfo: "", follow_labels: [{"john": "Follow"}]}}}}/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

