import sys
sys.path.insert(0, '../src')
from backend.webscraper.SongInfo import SongInfo
from bs4 import BeautifulSoup

'''
Class tests the functionality of the webscraper for getting songs
'''
def test_ConstructorCanValidateInput(): 
    '''
        First try/except should be able to validate that strings cannot be be called for scraping 
        Second try/except should be able to validate that number less than 0 cannot be scrapred
        Third try/except should be able to validate that numbers greater than 500 cannot be scraped
    '''
    try: 
        SongInfo('sdjhfsd')
    except: 
        assert True

    try:
        SongInfo(-1)
    except:
        assert True 

    try: 
        SongInfo(501)
    except: 
        assert True 

    try: 
        SongInfo(500)
        assert True
    except:
        assert False


def test_CanExtractRowValuesFromObject(): 
    '''
    Tests to see if relevant fields are able to be extracted from the table for an arbitrary row
    '''

    tr_string = """<tr> \
        <td>1</td> \
        <td><a href="javascript:document.getElementById('POWERTRK_155-14').play()"> \
        <img src="../play.png"/></a><audio id="POWERTRK_155-14" src="../samples/POWERTRK_155/sample-POWERTRK_155-14.mp3"></audio> \
        </td>
        <td><a name="tPOWERTRK_155-14"></a><a href="../artist/B/B167.html">Bob Dylan</a></td> \
        <td><a href="../title/L.html#tPOWERTRK_155-14">Like a Rolling Stone</a></td> \
        <td> 6:04</td> \
        <td><a href="../bpm/96.html"> 95.6</a></td>\
        <td><a href="../year/1965.html">1965</a></td> \
        <td><a href="../genre/genre31.html">Rock 1960s</a></td> \
        <td class="djddid"><a href="../disc/POWERTRK_155.html">POWERTRK_155-14</a></td> \
        <td>(<a href="../track/POWERTRK_155/POWERTRK_155-14.html">details...</a>)</td> \
    </tr> """
 
    soup = BeautifulSoup(tr_string, 'html.parser')
    tags = soup.find_all('tr')
    songScraper = SongInfo(0)
    dict_ = songScraper.fillAttributes(tags[0])
    assert dict_["artist"] == "Bob Dylan"
    assert dict_["song_title"] == "Like a Rolling Stone"
    assert dict_["genre"] == "Rock 1960s"
    assert dict_["year"] == 1965
    assert dict_["song_length"] == "6:04"
    assert dict_["info_link"] == "https://www.cs.ubc.ca/~davet/music/track/POWERTRK_155/POWERTRK_155-14.html"

def test_canExtractCompleteTable():
    '''
    Tests to see that all 500 rows can be extracted and that for an arbitrary row all of the 10 rows are scrappable
    ''' 
    songScraper = SongInfo(500)
    table = songScraper.scrapeTable()
    assert len(table) == 500

    soup = BeautifulSoup(table[342].text, 'html.parser')
    tags = soup.find_all('tr')
    for tag in tags:
        td_list = list(tag.find_all('td'))
        assert td_list == 10