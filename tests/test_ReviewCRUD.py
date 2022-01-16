from pymongo.message import query
import requests

'''
File will test all of the code regarding CRUD operations on the song reviews for a user 
'''

def test_successfulInsertion():
    '''
        Tests to ensure that a proper input song json can be succesfully inserted 
    '''
    userInfo = {"username": "nikhil", "userInfo": {"reviews": []}, "review": {"songTitle": "Hello", "rating": "3.1", "review": "This is a good song."}}
    r = requests.post("http://192.168.50.170:3000/modifyReviewList", json=userInfo)
    assert r.status_code == 200
    assert r.json() == {"reviews": [{"songTitle": "Hello", "rating": "3.1", "review": "This is a good song."}]}

def test_successfulUpdate():
    '''
        Tests to ensure that a proper input song json can be succesfully updated
    '''
    userInfo = {"username": "nikhil", "userInfo": {"reviews": []}, "review": {"songTitle": "Hello", "rating": "3.4", "review": "This is a catchy song."}}
    r = requests.post("http://192.168.50.170:3000/modifyReviewList", json=userInfo)
    assert r.status_code == 200
    assert r.json() == {"reviews": [{"songTitle": "Hello", "rating": "3.4", "review": "This is a catchy song."}]}

def test_successfulFind():
    '''
        Tests to ensure that proper input song json can be properly found
    '''
    userInfo = {"username": "nikhil", "userInfo": {"reviews": [{"songTitle": "Hello", "rating": "3.4", "review": "This is a catchy song."}]}, "review": {"songTitle": "Hello", "rating": "3.4", "review": "This is a catchy song."}}
    r = requests.post("http://192.168.50.170:3000/findSong", json=userInfo)
    assert r.status_code == 200
    assert r.json() == {"reviews": [{"songTitle": "Hello", "rating": "3.4", "review": "This is a catchy song."}]}

def test_successfulDelete():
    '''
        Tests to ensure that the deletion of a song that is present can be done 
    '''
    userInfo = {"username": "nikhil", "songTitle": "Hello", "userInfo": {"reviews": [{"songTitle": "Hello", "rating": "3.4", "review": "This is a catchy song."}]}}
    r = requests.post("http://192.168.50.170:3000/deleteSongReview", json=userInfo)
    assert r.status_code == 200
    assert r.json() == {"reviews": []}

def test_unsuccessfulInsertion():
    '''
        Tests to ensure that an unsuccesful for invalid json returns a 415 error
    '''
    userInfo = {"username": "nikhil", "userInfo": {"reviews": []}, "review": {"songTitle": "", "rating": "3.1", "review": "This is a good song."}}
    r = requests.post("http://192.168.50.170:3000/modifyReviewList", json=userInfo)
    assert r.status_code == 415

    userInfo = {"username": "nikhil", "userInfo": {"reviews": []}, "review": {"songTitle": "", "rating": "dsf", "review": "This is a good song."}}
    r = requests.post("http://192.168.50.170:3000/modifyReviewList", json=userInfo)
    assert r.status_code == 415


def test_unsuccessfulUpdate():
    '''
        Tests to ensure that an unsuccesful update for invalid json returns a 415 error
    '''
    userInfo = {"username": "nikhil", "userInfo": {"reviews": []}, "review": {"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}}
    r = requests.post("http://192.168.50.170:3000/modifyReviewList", json=userInfo)

    userInfo = {"username": "nikhil", "userInfo": {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}, "review": {"songTitle": "Good-Bye", "rating": "439875", "review": "This is a good song."}}
    r = requests.post("http://192.168.50.170:3000/modifyReviewList", json=userInfo)
    assert r.status_code == 415

    userInfo = {"username": "nikhil", "userInfo": {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}, "review": {"songTitle": "", "rating": "dsf", "review": "This is a good song."}}
    r = requests.post("http://192.168.50.170:3000/modifyReviewList", json=userInfo)
    assert r.status_code == 415

    userInfo = {"username": "nikhil", "songTitle": "Good-Bye", "userInfo": {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}}
    r = requests.post("http://192.168.50.170:3000/deleteSongReview", json=userInfo)


def test_unsuccessfulDelete():
    '''
    Returns a 404 error for a song that cannot be found 
    '''
    userInfo = {"username": "nikhil", "userInfo": {"reviews": []}, "review": {"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}}
    r = requests.post("http://192.168.50.170:3000/modifyReviewList", json=userInfo)

    userInfo = {"username": "nikhil", "songTitle": "Hello", "userInfo": {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}}
    r = requests.post("http://192.168.50.170:3000/deleteSongReview", json=userInfo)
    assert r.status_code == 404

    userInfo = {"username": "nikhil", "songTitle": "Good-Bye", "userInfo": {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}}
    r = requests.post("http://192.168.50.170:3000/deleteSongReview", json=userInfo)
 
    
def test_invalidGetTitleButValidRatingWorks():
    '''
    Returns 200 response for a query with a valid title but invalid rating 
    '''
    userInfo = {"username": "nikhil", "userInfo": {"reviews": []}, "review": {"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}}
    r = requests.post("http://192.168.50.170:3000/modifyReviewList", json=userInfo)
    userInfo = {"username": "nikhil", "userInfo": {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}, "review": {"songTitle": "", "rating": "3.1", "review": "This is a good song."}}
    r = requests.post("http://192.168.50.170:3000/findSong", json=userInfo)
    assert r.status_code == 200
    assert r.json() == {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}

    userInfo = {"username": "nikhil", "songTitle": "Good-Bye", "userInfo": {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}}
    r = requests.post("http://192.168.50.170:3000/deleteSongReview", json=userInfo)


def test_invalidGetRatingButValidTitleWorks():
    '''
    Returns 200 response for a query with a invalid title but valid rating 
    '''
    userInfo = {"username": "nikhil", "userInfo": {"reviews": []}, "review": {"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}}
    r = requests.post("http://192.168.50.170:3000/modifyReviewList", json=userInfo)
    userInfo = {"username": "nikhil", "userInfo": {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}, "review": {"songTitle": "Good-Bye", "rating": "wklkwjerwe", "review": "This is a good song."}}
    r = requests.post("http://192.168.50.170:3000/findSong", json=userInfo)
    assert r.status_code == 200
    assert r.json() == {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}
    
    userInfo = {"username": "nikhil", "songTitle": "Good-Bye", "userInfo": {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}}
    r = requests.post("http://192.168.50.170:3000/deleteSongReview", json=userInfo)

def test_invalidGetRatingAndInValidTitleReturnsError():
    '''
    Returns 415 response for a query with a invalid title but valid rating 
    '''
    userInfo = {"username": "nikhil", "userInfo": {"reviews": []}, "review": {"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}}
    r = requests.post("http://192.168.50.170:3000/modifyReviewList", json=userInfo)
    userInfo = {"username": "nikhil", "userInfo": {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}, "review": {"songTitle": "", "rating": "wklkwjerwe", "review": "This is a catchy song."}}
    r = requests.post("http://192.168.50.170:3000/findSong", json=userInfo)
    assert r.status_code == 415
    userInfo = {"username": "nikhil", "songTitle": "Good-Bye", "userInfo": {"reviews": [{"songTitle": "Good-Bye", "rating": "3.1", "review": "This is a good song."}]}}
    r = requests.post("http://192.168.50.170:3000/deleteSongReview", json=userInfo)
    
    