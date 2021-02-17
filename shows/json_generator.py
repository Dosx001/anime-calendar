import json
from os import popen
from html import unescape

def main():
    with open('new.html') as f:
        source = f.readlines()

    getTitle = {
        'AnimeLab': lambda url: AnimeLab(url),
        'Crunchyroll': lambda url: Crunchyroll(url),
        'Netflix': lambda url: Netflix(url),
    }
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
                if cover[-3::] != "jpg":
                    cover = cover[0:-4]
            elif 'class="stream-link"' in line and 'title' in line:
                stream = line.split()
                streams.update({stream[6][7:-1]:stream[1][6:-1]})
            elif "show-title-bar" in line:
                for stream in getTitle:
                    if stream in streams:
                        title = getTitle[stream](streams[stream])
                        break
                else:
                    title = line.split()[1::]
                    title[0] = title[0][23::]
                    title[-1] = title[-1][0:-5]
                    title = " ".join(title)
                try:
                    streams.pop("Netflix")
                except KeyError:
                    pass
                content = {
                    'day': day,
                    'time': time,
                    'cover': cover,
                    #'score': winner,
                    'streams': dict(sorted(streams.items(), key = lambda show: show[0]))
                }
                try:
                    shows.update({unescape(title): content})
                except:
                    shows.update({"Theatre of Darkness: Yamishibai": content})
                streams = {}
        json.dump(shows, file, indent = 4)

def getData(url):
    return popen(f"curl -k {url} -H 'User-Agent: Firefox/60.0'").read().split("\n")

def Crunchyroll(url):
    Bool = False
    for line in getData(url):
        if Bool:
            line = line.split()
            line[0] = line[0][6::]
            line[-1] = line[-1][0:-7]
            return " ".join(line)
        elif "ellipsis" in line:
            Bool = True

def AnimeLab(url):
    for line in getData(url):
        if "show-title" in line:
            line = line.split()[1::]
            line[0] = line[0][19::]
            line[-1] = line[-1][0:-5]
            return " ".join(line)

def Netflix(url):
    title = []
    Bool = False
    for line in getData(url)[0].split(" "):
        if Bool:
            if line != "|":
                title.append(line)
            else:
                return " ".join(title)
        elif "/><title>" in line:
            title.append(line[267::])
            Bool = True

if __name__ == "__main__":
    main()
