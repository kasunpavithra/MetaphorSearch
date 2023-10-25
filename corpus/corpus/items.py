# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class CorpusItem(scrapy.Item):
    title = scrapy.Field()
    genre = scrapy.Field()
    artist = scrapy.Field()
    lyricist = scrapy.Field()
    musicComposer = scrapy.Field()
    views = scrapy.Field()
    lyrics = scrapy.Field()
