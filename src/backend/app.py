from flask import Flask, request
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS
import bcrypt
from pymongo.message import query
import requests

app = Flask(__name__)

mongo = client = MongoClient("mongodb+srv://nikhilk5:fluffy63@cluster0.pj5mb.mongodb.net/SongFinderApp?retryWrites=true&w=majority")
db = mongo["SongFinderApp"]
serverStatusResult = db.command("serverStatus")
CORS(app)

'''
The purpose of this file is to store all of the routes related to 
'''
@app.route("/findUserLogin", methods=["POST"])
def getLoginInfo():
    '''
    Function checks to see if a user is able to be found based on their username and password for the Login Screen
    '''
    loginInfo = request.get_json()
    hashed_pwd = generateHashedPassword(loginInfo["password"])
    users = list(db.get_collection("UserInfo").find({"username": loginInfo["username"]}))
    if bcrypt.checkpw(loginInfo["password"].encode('utf-8'), hashed_pwd) and len(users) > 0:
        dict_ = users[0]
        return dict_["userInfo"], 200
        
    return "User not found", 404

@app.route("/addUserLogin", methods = ["POST"])
def addUserInfo():
    '''
    Function will create a user account from the username and password based on what was inputted on the New Account Screen.
    This information goes to the MongoDB database. Should a username already be taken, the user is notified of this. 
    '''
    loginInfo = request.get_json()
    existing_user = list(db.get_collection("UserInfo").find({"username": loginInfo["username"]}))
    
    if len(existing_user) > 0:
      return "User with username has already been inserted", 400

    preferences = {"artist": "None", "genre": "None", "year": 0}
    reviews = []
    followers = []
    following = []
    userInfo = {"preferences": preferences, "reviews": reviews, "image": "https://www.shareicon.net/data/512x512/2016/08/18/809259_user_512x512.png", "followers": followers, "following": following}

    db.get_collection("UserInfo").insert_one({"username": loginInfo["username"], "password": generateHashedPassword(loginInfo["password"]), 
       "userInfo": userInfo})
    return userInfo, 200

@app.route("/updateUserInfo" , methods = ["POST"])
def updateUserInfo():
    '''
    Function updates the a user's bookmark preferences based on what the user's username and their perferences.
    The new preferences are taken from the database and returned for the screen pages to use 
    '''  
    userInfo = request.get_json()
    
    try:
        db.get_collection("UserInfo").find_one_and_update({"username": userInfo["username"]}, {"$set": userInfo})
        users = list(db.get_collection("UserInfo").find({"username": userInfo["username"]}))
        dict_ = users[0]
        return dict_["userInfo"], 200
    except: 
        return "Update unsuccessful", 500

@app.route("/querySong", methods = ["POST"])
def findSongsFromQuery():
    '''
    Function performs a query based on user preferences and returns all results where the song contains at least one of the queries
    information 
    ''' 
    try: 
        json = request.get_json()
        preferences = json["preferences"]
        songs = list(db.get_collection("SongInfo").find({"$or": [{"artist": preferences["artist"]}, {"genre": preferences["genre"]} , {"year": int(preferences["year"])}]}))
        return dumps(songs), 200
    except:
        return "Results not found", 500


def generateHashedPassword(pwd): 
    '''
    Function generates a hashed password from the inputted password by the user and returns it back for the MongoDB database to store. 
    '''
    salt = bcrypt.gensalt()
    hashedPwd = bcrypt.hashpw(pwd.encode('utf-8'),  salt) 
    return hashedPwd

@app.route('/modifyReviewList', methods = ["POST"])
def changeReviewList():
    '''
    Function will modify the review list if an update or insert is being maded
    '''
    userInfo = request.get_json()
    inputReview = userInfo["review"]

    if isValidTitle(inputReview["songTitle"]) or isValidRating(inputReview["rating"]) is False:
        return "Improper Format", 415
    
    reviews = userInfo["userInfo"]["reviews"]
    songTitle = inputReview["songTitle"]

    for i in range(len(reviews)):
        if songTitle in reviews[i].values():
            reviews[i] = inputReview
            del userInfo["review"]
            result = requests.post("http://192.168.50.170:3000/updateUserInfo", json = userInfo)
            return result.json(), 200

    reviews.append(inputReview)
    del userInfo["review"]
    result = requests.post("http://192.168.50.170:3000/updateUserInfo", json = userInfo)
    
    return result.json(), 200

@app.route("/deleteSongReview", methods = ["POST"])
def deleteSongReview():
    '''
    Deletes a user's review based the review that is passed in
    '''
    userInfo = request.get_json()
    songTitle = userInfo["songTitle"]
    reviews = userInfo["userInfo"]["reviews"]

    for i in range(len(reviews)):
        if songTitle in reviews[i].values():
            del reviews[i]
            del userInfo["songTitle"]
            result = requests.post("http://192.168.50.170:3000/updateUserInfo", json = userInfo)
            return result.json(), 200
    return "Song not found", 404

@app.route("/findSong", methods = ["POST"])
def searchSong():
    '''
    Searches for a new song 
    '''
    json = request.get_json()
    reviews = json["userInfo"]["reviews"]
    review = json["review"]
    inputSongTitle = review["songTitle"]
    inputRating = review["rating"]
    
    searchBoth = False

    if isValidTitle(inputSongTitle) and isValidRating(inputRating) is False:
        return "Please enter a valid query", 415

    if isValidTitle(inputSongTitle) is False and isValidRating(inputRating):
        searchBoth = True

    matches = []
    for i in range(len(reviews)):
        songTitle = reviews[i]["songTitle"]
        rating = reviews[i]["rating"]

        if (searchBoth and inputSongTitle == songTitle and inputRating == rating) or (searchBoth is False and (inputSongTitle == songTitle or inputRating == rating)):
            matches.append(reviews[i])
            
    return {"reviews": matches}, 200

def isValidTitle(title):
    '''
    The following function checks if the review the user has added or updated is valid or not 
    ''' 
    return title == ""

def isValidRating(rating):
    '''
    Checks if the inputted rating is valid or not
    '''
    try:
       rating = float(rating)
       if rating >= 0.0 and rating <= 5.0:
            return True
       else:
            return False
    except:
        return False

@app.route("/uploadUserImage" , methods = ["POST"])
def uploadUserImage():
    '''
    Saves a new image based on the uri that gets passed in
    '''
    try:
        userInfo = request.get_json()
        image_uri = userInfo["newImage"]
        userInfo["userInfo"]["image"] = image_uri
        del userInfo["newImage"]
        result = requests.post("http://192.168.50.170:3000/updateUserInfo", json = userInfo)
        return result.json(), 200
    except:
        return "Invalid user input", 500

@app.route("/findByUsername", methods = ["POST"])
def findByUserName(): 
    '''
    Find all users based on the result of their username result 
    '''
    try:
        json = request.get_json()
        userInfo = json["userInfo"]
        following_list = userInfo["following"]
        name = json["userNameQuery"]
        result = list(db.get_collection("UserInfo").find({"username": name}))
        dict_ = result[0]
        follow_labels = createFollowLabel(following_list, [dict_["username"]])

        return {"username": dict_["username"], "userInfo": dict_["userInfo"], "follow_labels": follow_labels}, 200
    except:
        return "Invalid user input", 500

@app.route("/findByBookmarkPref", methods = ["POST"])
def findByBookmarkPref():
    '''
    Returns the list of all users that match at least one of the user queries 
    '''

    try:
        userInfo = request.get_json()
        print(userInfo)
        queryPref = userInfo["queryPref"]
        artist = queryPref["artist"]
        genre = queryPref["genre"]
        year = queryPref["year"]
        results = list(db.get_collection("UserInfo").find({"$or": [{"userInfo.preferences.year": year}, {"userInfo.preferences.genre": genre}, {"userInfo.preferences.artist": artist}]}))
        following_list = userInfo["userInfo"]["following"]

        queryResultNames = []
        for i in range(len(results)):
            dict_ = results[i]
            name = dict_["username"]
            profileInfo = dict_["userInfo"]
            if name not in following_list:
                queryResultNames.append({"name": name, "profileInfo": profileInfo, "follow_type": "Follow"})
            else: 
                queryResultNames.append({"name": name, "profileInfo": profileInfo, "follow_type": "Following"})

        return {"follow_labels": queryResultNames}, 200
    except:
        return "Invalid user input", 500

@app.route("/updateFollowStatus", methods = ["POST"])
def updateFollowStatus():
    '''
    Updates the follower status of the user and the following status of the indiviudal being followed 
    '''

    json = request.get_json()
    user_follow_list = json["userInfo"]["following"]
    user_follow_list.append(json["followName"])
    followers_list = json["followInfo"]["followers"]
    followers_list.append(json["username"])
    user_update = requests.post("http://192.168.50.170:3000/updateUserInfo", json = {"username": json["username"], "userInfo": json["userInfo"]})
    requests.post("http://192.168.50.170:3000/updateUserInfo", json = {"username": json["followName"], "userInfo": json["followInfo"]})
   
    userInfo = user_update.json()

    follow_labels = []
    if "userList" not in json:
        follow_labels = createFollowLabel(user_follow_list, [json["followName"]])
    else:
        userList = json["userList"]
    
        for i in range(len(userList)):
            dict_ = userList[i]
            name = dict_["name"]
            if name == json["username"]:
                continue 
            if name not in user_follow_list:
                userList[i]['follow_type'] = "Follow"
            else: 
                userList[i]['follow_type'] = "Following"

        return {"follow_labels": userList, "userInfo": user_update.json()}, 200
 
    userInfo["follow_labels"] = follow_labels
    
    return userInfo, 200
    

def createFollowLabel(following_list, query_names):
    '''
    Function will produce labels on whether the user is or is not following users from the query
    '''
    follow_label = []
    for i in range(len(query_names)):
        
        if query_names[i] not in following_list:
            follow_label.append({query_names[i]: "Follow"})
        else:
            follow_label.append({query_names[i]: "Following"})
    
    return follow_label

if __name__ == "__main__": 
    app.run(host = '192.168.50.170', port = 3000, debug= True)