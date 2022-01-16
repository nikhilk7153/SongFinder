from bs4 import BeautifulSoup
import requests
from pymongo import MongoClient

mongo = client = MongoClient("mongodb+srv://nikhilk5:fluffy63@cluster0.pj5mb.mongodb.net/SongFinderApp?retryWrites=true&w=majority")
db = mongo["SongFinderApp"]
serverStatusResult = db.command("serverStatus")
collection = db.test_collection

class SongInfo:
    '''
    Class gets the number of songs to scrape and then scrapes them from a url. Functions help with adding the individual info for 
    each song.
    ''' 

    numSongs_ = 0 # number of songs that will be scraped
    scrapingLink = 'https://www.cs.ubc.ca/~davet/music/list/Best9.html' # link that will be used for webscrpaing 
   
    def __init__(self, numSongs): 
        '''
        Constructor initializes the number of songs to be scraped before calling the scraping function 
        '''
        if numSongs < 0 or  numSongs > 500:
            raise ValueError("Please enter a number between 0 and 500")
        self.numSongs_ = numSongs
        self.scrapeTable()

    def scrapeTable(self):
        '''
        Initializes the soup object to perfom the scraping and locates the table and the rows to be extracted. 
        Iteratively goes through the number of rows specified by the user. 
        '''
        requests_session = requests.Session()
        urlHtml = requests_session.get(self.scrapingLink, headers={"User-Agent":"Mozilla/5.0"})
        soup = BeautifulSoup(urlHtml.text, 'lxml')

        table = soup("table", {"class": "music"})
        trs = soup.find_all('tr')
        tr_list = list(trs)
        lastSongIndex = self.numSongs_ + 2
        tr_list = tr_list[2:lastSongIndex]
     
        for tr in tr_list:
            self.fillAttributes(tr)
            
        return tr_list
        

    def fillAttributes(self, tr_element):
        '''
        Function populates the attributes from each row for every song
        '''
        dict_ = {"artist": "", "song_title": "", "song_length": "", "genre": "", "year": 0,
                    "info_link": ""}
 
        td_list = list(tr_element.find_all('td'))
        dict_["artist"] = td_list[2].text
        dict_["song_title"] = td_list[3].text
        dict_["song_length"] = td_list[4].text.lstrip("' ").rstrip("'")
        dict_["year"] = int(td_list[6].text)
        dict_["genre"] = td_list[7].text 
        
        a = td_list[9].find_all('a', href = True)
        link_suffix = a[0]['href']
        dict_["info_link"] = 'https://www.cs.ubc.ca/~davet/music' + link_suffix.lstrip("..")
    
        #db.get_collection("SongInfo").insert_one(dict_)
        return dict_