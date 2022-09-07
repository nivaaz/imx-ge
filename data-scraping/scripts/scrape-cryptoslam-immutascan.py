from bs4 import BeautifulSoup
from selenium import webdriver
import re
import numpy as np
import time

# TODO: fix naming for all the functios
# TODO: fix naming for all variables
# TODO: add comments for readability

def rendering(url):
    """open a new chrome window, scroll to the bottom and get the html
    Args:
        url (string): url
    """
    # change '/usr/local/bin/chromedriver' to the path from you got when you ran 'which chromedriver'
    driver = webdriver.Chrome('C:/Users/nkseh/Downloads/chromedriver_win32/chromedriver.exe') # run ChromeDriver
    driver.get(url)                                          # load the web page from the URL
    time.sleep(3)                                            # wait for the web page to load
    driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")  # scroll to bottom to get all info
    time.sleep(5)                                            # wait for the web page to load
    render = driver.page_source                              # get the page source HTML
    driver.quit()                                            # quit ChromeDriver
    return render                                            # return the page source HTML


def getIMXCollections():
    """ open a new chrome window, scroll to the bottom and get the html and write into a file.
    """
    search_url = 'https://immutascan.io/collections'
    webPage = rendering(search_url)
    soup = BeautifulSoup(webPage, 'html.parser')
    
    collections = soup.find_all('p')
    
    f = open("../output-data/imx-collections.txt", "a", encoding="utf-8")
    
    for collection in collections:
        collectionData = collection.getText()
        if(collectionData):
            f.write(collectionData)
            f.write('\n')
    
    f.close()

## could be a duplicate function
def getCsBlockchainsByNftSales24h():
    """get the Cryptoslam blockchains by nft sales for the last 24 hours and write into a file
    """
    search_url = 'https://cryptoslam.io/'
    webPage = rendering(search_url)
    soup = BeautifulSoup(webPage, 'html.parser')
    #  get the nft collection table ONLY
    collectionTable = soup.find_all('table', {'class': 'table table-hover js-top-by-sales-table-24h summary-sales-table'})
  
    headings = collectionTable[2].find_all('th')
    children = collectionTable[2].findChildren('td')  # get the td elements in that table

    f = open("../output-data/cs-blockchains-by-nft-sales-volume.json", "a", encoding="utf-8")

    fieldsList = []
    dataList = []
    tempItem = {}

    for h in headings:
        headingString = str(h.getText()).strip()
        fieldsList.append(headingString)

    lengthOfArr = len(fieldsList)
    for idx, child in enumerate(children):
        stringToPrint = str(child.getText()).strip()
        tempItem[fieldsList[idx%lengthOfArr]] = re.sub("\,|ETH|\%|\$",'', stringToPrint)
        if (idx%lengthOfArr == 0 or idx == lengthOfArr-1 ):
            dataList.append(tempItem)
            tempItem = {}
    
    f.write(str(dataList))
    f.close()


def checkCryptoSlamDataHasAllImxCollections():
    """check that the crypto slam data also has the some of the collections from crypto slam
    print the result
    """
    imxCollectionNames = []
    cryptoSlamCollectionNames = []
    # get all the imx collection names:
    lenImxScanFile = 600
    numLinesBetweenCollectionsImx = 6
    f = open("../output-data/imx-collections.txt", "r", encoding="utf-8")
    fileopened = f.readlines()

    for counter in range(1,lenImxScanFile ,numLinesBetweenCollectionsImx):
        collectionName = fileopened[counter]
        imxCollectionNames.append(collectionName)

    print(len(imxCollectionNames))
    f.close()

    # get all the cryptoslam collection names
    lenCryptoSlamFile = 1500 # got from looking at the number of file lines manually.
    numLinesBetweenCollections = 6 # manually worked it out
    
    f = open("../output-data/imx-cyptoslam-collections.txt", "r", encoding="utf-8")
    fileopened = f.readlines()
 
    for counter in range(1,lenCryptoSlamFile ,numLinesBetweenCollections):
        collectionName = fileopened[counter]
        cryptoSlamCollectionNames.append(collectionName[:len(collectionName)//2])  #remove duplicate collection name, could be moved to when we scrape data.
    f.close()
 
    # get difference between two sets of data
    diff =  np.intersect1d(imxCollectionNames, cryptoSlamCollectionNames)
    print(diff)

def getImmutascanCollectionAddresses():
    """ get top 100 collection addresses and collection name, write into file
    """
    search_url = 'https://immutascan.io/collections'
    webPage = rendering(search_url)
    soup = BeautifulSoup(webPage, 'html.parser')
    
    collections = soup.find_all('a',  href=True)

    collectionData = {} 
    f = open("../output-data/imx-collection-addresses-2.json", "a", encoding="utf-8")
    f.write('[')
    for  collection in collections:
        collectionData['address'] = re.sub("\/address\/|\?tab=1\&forSale=true", "", str(collection['href']).strip())  
        collectionData['name'] = str(collection.getText()).strip()

        if(collectionData):
            f.write(str(collectionData))
            f.write(', \n')
        collectionData = {} 
    f.write(']')
    f.close()

def getCsCollectionRankingsByTimeFrame(timeFrame):
    """_summary_
    Get Cryptoslam collection rankings by time frame amd write into file
    Args:
        timeFrame (string): time frame should be 24h, 7d or 30d
    """
    search_url = 'https://cryptoslam.io/nfts?tab=' + timeFrame
    webPage = rendering(search_url)
    soup = BeautifulSoup(webPage, 'html.parser')

    headings = soup.find_all('th')
    children = soup.find_all('td')

    f = open("../output-data/cryptoslam-nft-ranking-sales-volume" + timeFrame + ".json", "a", encoding="utf-8")

    fieldsList = []
    dataList = []
    tempItem = {}

    for h in headings:
        headingString = str(h.getText()).strip()
        fieldsList.append(headingString)

    lengthOfArr = len(fieldsList)
    for idx, child in enumerate(children):
        stringToPrint = str(child.getText()).strip()
        tempItem[fieldsList[idx%lengthOfArr]] = re.sub("\,|ETH|\%|\$",'', stringToPrint)
        if (idx%lengthOfArr == 0 or idx == lengthOfArr-1 ):
            dataList.append(tempItem)
            tempItem = {}
    
    f.write(str(dataList))
    f.close()

def getAllCsCollectionRanking():
    """ get CryptoSlam collection ranks for 24h, 7d and 30d
    """
    timeFrames = ['24h', '7d', '30d']
    for t in timeFrames:
        getCsCollectionRankingsByTimeFrame(t)


# ***** FUCNTION TO RUN ***** 
# getImmutascanCollectionAddresses()
# getCsBlockchainsByNftSales24h()
# getAllCsCollectionRanking()
getImmutascanCollectionAddresses()