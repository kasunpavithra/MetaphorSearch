import json

with open('../data.json') as fp:
    data = json.load(fp)

with open('../song.json', 'w', encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)