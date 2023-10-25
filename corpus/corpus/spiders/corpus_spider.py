import scrapy
from corpus.items import CorpusItem
from mtranslate import translate
import re
import json

def translation_array(stringArray):
    translated_array = []
    for string in stringArray:
        translated_array.append(translate(string, 'si', 'en'))
    return translated_array

class CorpusSpider(scrapy.Spider):
    name = 'songs'
    start_urls = ["https://www.sinhalasongbook.com/tag/new-pop/page/6/"]  
    # for i in range(2,11):
    #     start_urls = ["https://www.sinhalasongbook.com/tag/new-pop/page/"+str(i)+"/"]
            
    def parse(self, response):
        for href in response.xpath("//main[contains(@id, 'genesis-content')]/article/header[contains(@class, 'entry-header')]/h2[contains(@class, 'entry-title')]/a/@href"):
            url = href.extract()

            yield scrapy.Request(url, callback=self.parse_dir_contents)  

    def parse_dir_contents(self, response):

        item = CorpusItem()

        #song title
        title = response.xpath("//div[contains(@class, 'site-inner')]//header[contains(@class, 'entry-header')]/h1/text()").extract()[0]
        item['title'] = re.split('[\–|-]', title)[1].strip()

        genre = response.xpath("//div[contains(@class, 'entry-content')]//div[contains(@class, 'su-column su-column-size-3-6')]//span[contains(@class, 'entry-tags')]/a/text()").extract()
        item['genre'] = translation_array(genre)
            
        #artist name
        artist = response.xpath("//div[contains(@class, 'entry-content')]//div[contains(@class, 'su-column su-column-size-3-6')]//span[contains(@class, 'entry-categories')]/a/text()").extract()
        item['artist'] = translation_array(artist)
                
        #lyricist
        lyricist = response.xpath("//div[contains(@class, 'entry-content')]//div[contains(@class, 'su-column su-column-size-2-6')]//span[contains(@class, 'lyrics')]/a/text()").extract()
        item['lyricist'] = translation_array(lyricist)
        
        #musicComposer
        musicComposer = response.xpath("//div[contains(@class, 'entry-content')]//div[contains(@class, 'su-column su-column-size-2-6')]//span[contains(@class, 'music')]/a/text()").extract()
        item['musicComposer'] = translation_array(musicComposer)
        
        #views
        views = response.xpath("//div[contains(@class, 'entry-content')]/div[contains(@class, 'tptn_counter')]/text()").extract()[0]
        item['views']  = int(re.sub('[^0-9,]', "", views).replace(',', ''))
       
        #lyrics
        lyrics = response.xpath("//div[contains(@class, 'entry-content')]//pre/text()").extract()           
        song = ''
        check_newline = False
            
        for line in lyrics:
            lines = (re.sub("[\da-zA-Z\d0-9\-—\[\]\(\)\}\{\@\_\!\#\+\$\%\^\&\*\<\>\?\|\~\:\∆\/]", "", line)).split('\n')
            for line_l in lines:
                if not(line_l.isspace() or line_l == ""):
                    song += line_l.strip()
                    check_newline = True
                else:
                    if check_newline:
                        song += '\\n'
                        check_newline = False
                            
        item['lyrics'] = song

        yield item

