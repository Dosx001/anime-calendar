import yaml
import json
from difflib import SequenceMatcher
import html.parser as htmlparser
parser = htmlparser.HTMLParser()

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
                    title = title[1::]
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
                get_streams = {}
                for link in streams:
                    if streams[link] != "":
                        if link == 'funimation|Funimation':
                            get_streams.update({'Funimation': streams[link]})
                        elif link == 'animelab|AnimeLab':
                            get_streams.update({'AnimeLab': streams[link]})
                        elif link == 'vrv|VRV':
                            get_streams.update({'VRV': streams[link]})
                        elif link == 'wakanim|Wakanim':
                            get_streams.update({'Wakanim': streams[link]})
                        elif link == 'hulu|Hulu':
                            get_streams.update({'Hulu': streams[link]})
                        elif link == 'crunchyroll_nsfw|Crunchyroll' or link == 'crunchyroll':
                            get_streams.update({'Crunchyroll': streams[link]})
                        elif link == 'crunchyroll_nsfw|Crunchyroll' or link == 'crunchyroll':
                            get_streams.update({'Crunchyroll': streams[link]})
                        elif link == 'hidive':
                            get_streams.update({'Hidive': streams[link]})
                        elif link == 'anione':
                            get_streams.update({'YouTube': streams[link]})
                        elif link != "" and link != 'nyaa':
                            get_streams.update({link: streams[link]})
            content = {
                'day': day,
                'time': time,
                'cover': cover,
                #'score': winner,
                'streams': get_streams
            }
            shows.update({parser.unescape(title): content})
    json.dump(shows, file, indent=4)
