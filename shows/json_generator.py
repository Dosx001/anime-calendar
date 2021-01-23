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
    streams = {}
    for line in source:
        if "timetable-column-day" in line:
            day = line[73:-6]
        elif "show-air-time" in line:
            time = line[28:-8]
        elif 'show-poster' in line and not 'lazy' in line:
            cover = line.split()[1][5:-13]
            if "nanatsu" in cover:
                cover = cover[0:-4]
        elif 'class="stream-link"' in line and 'title' in line:
            stream = line.split()
            streams.update({stream[6][7:-1]:stream[1][6:-1]})
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
            content = {
                'day': day,
                'time': time,
                'cover': cover,
                #'score': winner,
                'streams': dict(sorted(streams.items(), key = lambda show: show[0]))
            }
            shows.update({parser.unescape(title): content})
            streams = {}
    json.dump(shows, file, indent=4)
