from SongInfo import SongInfo
import argparse

'''
File is meant to help with getting the information from the terminal to know how many unique songs should be scraped.
Once this information is obtained, the scraper will scrape the number of songs inputted by the user in the SongInfo class
and add it to the MongoDB database  
'''

parser = argparse.ArgumentParser(prog = 'Driver')
parser.add_argument('-n', '--numSongs', type = int)
args = parser.parse_args()
numSongs = args.numSongs
scraper = SongInfo(numSongs)


