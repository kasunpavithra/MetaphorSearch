# Sinhala-Songs-Search-Engine
This project is to build a Text Corpus and a Search Application

## Introduction
The search engine will be developed to search about *Sinhala songs in the new pop genre*. The seach engine will be developed using the **ElasticSearch** framework.

## Building Corpus
- Install scrapy using `pip install Scrapy` and run `pip install Twisted==22.8.0`
- Refer https://docs.scrapy.org/en/latest/intro/tutorial.html to set up a new scrapy project.
- Go to corpus directory & Run `scrapy crawl songs -O data.json` to store the scraped data in json format(& in unicode).
- Go to corpus/corpus directory & Run `python3 -m unicode_converter` to convert unicode to Sinhala characters.

## Indexing and Text Processing
- Use PUT /songs and add content in search/tokenize.json in Kibana Console to create index
- Use POST _bulk and add content in corpus/song1.txt to add documents to the index
- When creating the index,
    - The built-in standard tokenizer is used to tokenize the text. The standard tokenizer splits  the text into words  based on whitespace and punctuation, which is a common way of tokenizing text.
    - The "stop" filter is used to remove words that are not useful for search.

## Main functions of the system
- **Full Text Search**
    - Search a song based on the artist\
        Example - සුනිල් එදිරිසිංහ ගැයු ගීත, සුනිල් එදිරිසිංහ කිව් ගී
    - Search a song based on the musicComposer\
        Example - තිළිණ රුහුණුගේ විසින් සංගීතවත් කළ ගීත
    - Search a song based on the lyricist\
        Example - යමුනා මාලනී පෙරේරා රචනා කළ සිංදු, ධර්මරත්න පෙරේරා විසින් රචිත ගීත
    - Search a song based on the genre\
        Example - සම්භාව්ය වර්ගයේ ගීත, නව පොප් වර්ගයේ ගී
    - Search a song based on the title\
        Example - ඔය සුසුම් පවන්
    - Search a song based on the lyrics\
        Example - කොඳුර කොඳුර කවි කියන්න
- **Faceted Search**\
    Filter search results based on the music composer and the lyricist
- **Sort by Views**

![search](/images/search.png)
