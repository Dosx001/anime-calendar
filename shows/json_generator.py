import yaml
import json
from difflib import SequenceMatcher

with open('winter_2021.yaml', 'r') as f:
    data = list(yaml.load_all(f))

with open('fall_2020.yaml', 'r') as f:
    old = list(yaml.load_all(f))

with open('long.yaml', 'r') as f:
    Long = list(yaml.load_all(f))

with open('code.html') as f:
    source = f.readlines()

shows = {}
with open('shows.json', 'w') as file:
    Bool = False
    for line in source:
        if Bool == True:
            time = line.replace("\n", "")
            if time != "":
                Bool = False
        if "timetable-column-day" in line:
            day = line[73:-6]
        elif "show-air-time" in line:
            Bool = True
        elif 'class="show-poster"' in line:
            cover = line.split()[1][5:-13]
        elif "show-title-bar" in line:
            title = line.split()[1::]
            title[0] = title[0][23::]
            title[-1] = title[-1][0:-5]
            try:
                if "Suppose" in title[1]:
                    title[1] = "Suppose"
            except IndexError:
                pass
            title = " ".join(title)
            winner = 0
            scores = []
            for item in data + old + Long:
                scores.append(SequenceMatcher(None, item['title'], title).ratio())
                try:
                    for name in item['alias']:
                        scores.append(SequenceMatcher(None, name, title).ratio())
                except KeyError:
                    pass
                for score in scores:
                    if winner < score:
                        winner = score
                        streams = item['streams']
            if winner < .5:
                streams = None
            else:
                try:
                    for link in streams:
                        if streams[link] == "":
                            streams[link] = None
                    streams['funimation'] = streams.pop('funimation|Funimation')
                    streams['wakanim'] = streams.pop('wakanim|Wakanim')
                    streams['animelab'] = streams.pop('animelab|AnimeLab')
                    streams['vrv'] = streams.pop('vrv|VRV')
                    streams['hulu'] = streams.pop('hulu|Hulu')
                    streams.pop('amazon|Amazon US')
                    streams.pop('amazon_uk|Amazon UK')
                    streams.pop('primevideo|Prime Video International')
                    if streams['crunchyroll_nsfw|Crunchyroll'] != None:
                        streams['crunchyroll'] = streams.pop('crunchyroll_nsfw|Crunchyroll')
                    else:
                        streams.pop('crunchyroll_nsfw|Crunchyroll')
                except KeyError:
                    pass
            content = {
                'day': day,
                'time': time,
                'cover': cover,
                #'score': winner,
                'streams': streams
            }
            shows.update({title: content})
    json.dump(shows, file, indent=4)
