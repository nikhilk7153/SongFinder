from pymongo.message import query
import requests
import bcrypt

'''
class tests App.py in the backend
'''

def test_LoginInfoWorksOnValidUser():
    '''
    Tests to ensure that a user with a valid login and password can login 
    '''
    userInfo = {"username": "nsk7153", "password": "nikhil7153", "preferences": {"genre": "rock", "artist": "Michael Jackson", "year": 1985}}
    r = requests.post("http://192.168.50.170:3000/findUserLogin", json=userInfo)
    assert r.status_code == 200

def test_LoginInfoWorksOnInValidUser():
    '''
    Checks to make sure that a user with an invalid password but valid username cannot login and a user with an
    invalid username cannot login either 
    '''
    userInfo = {"username": "nsk7153", "password": "nikhil7", "preferences": {"genre": "rock", "artist": "Michael Jackson", "year": 1985}}
    r = requests.post("http://192.168.50.170:3000/findUserLogin", json=userInfo)
    assert r.status_code == 200
    
    userInfo = {"username": "nsk7", "password": "nikhil7153", "preferences": {"genre": "rock", "artist": "Michael Jackson", "year": 1985}}
    r = requests.post("http://192.168.50.170:3000/findUserLogin", json=userInfo)
    assert r.status_code == 404


def test_addUserInfoForNewAccount():
    '''
    Ensures that a user name that is not added to the database, can be added to the database  
    '''
    userInfo = {"username": "abefcy", "password": "bob", "preferences": {"genre": "rock", "artist": "Michael Jackson", "year": 1985}}
    r = requests.post("http://192.168.50.170:3000/addUserLogin", json=userInfo)
    assert r.status_code == 200


def test_addUserInfoForExistingUserName():
    '''
    Ensures that a user with already existing user name gets properly added 
    '''
    userInfo = {"username": "abefcy", "password": "bob", "preferences": {"genre": "rock", "artist": "Michael Jackson", "year": 1985}}
    r = requests.post("http://192.168.50.170:3000/addUserLogin", json=userInfo)
    assert r.status_code == 400


def test_updatePreferencesWorks():
    '''
    Makes sure that the user's preferences are properly updated by getting the updated json upon updating the user's preferences 
    '''
    userInfo = {"username": "nsk7153", "password": "bob7153", "preferences": {"genre": "hip-hop", "artist": "Taylor Swift", "year": 2016}}
    r = requests.post("http://192.168.50.170:3000/updateUserInfo", json=userInfo)
    assert r.status_code == 200
    dict_pref = r.json()
    assert dict_pref["genre"] == "hip-hop"
    assert dict_pref["artist"] == "Taylor Swift"
    assert dict_pref["year"] == 2016

def test_SongsFromQuery():
    '''
    Checks that a user's perferences yield to the correct query results
    '''
    userInfo = {"preferences": {"genre": "", "artist": "Bob Dylan", "year": 1965}}
    r = requests.post("http://192.168.50.170:3000/querySong", json=userInfo)
    assert r.status_code == 200
    queryResult = r.json()
   
    list_ = queryResult
    assert len(list_) == 23

def test_generatedHashPaassword(): 
    '''
    A string on which the password has been hashed should be detectable so as to know if a user is giving a valid 
    password before the hashing is performed
    '''
    pwd = "hello"
    salt = bcrypt.gensalt()
    hash_pwd = bcrypt.hashpw(pwd.encode(), salt)
    assert bcrypt.checkpw(pwd.encode(), hash_pwd)
    
    unhashed = "hi"
    assert bcrypt.checkpw(unhashed.encode(), hash_pwd) == False
