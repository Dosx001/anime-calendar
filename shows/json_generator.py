import json
from os import popen
from html import unescape

def main():
    with open('new.html') as f:
        source = f.readlines()

    getTitle = {
        'AnimeLab': lambda url: AnimeLab(url),
        'Crunchyroll': lambda url: Crunchyroll(url),
        'HiDive': lambda url: HiDive(url),
        'Netflix': lambda url: Netflix(url),
    }
    shows = {}
    with open('shows.json', 'w') as file:
        streams = {}
        for line in source:
            if "timetable-column-day" in line:
                day = line[75:-6]
            elif "show-air-time" in line:
                time = line[30:-8]
            elif 'show-poster' in line and not 'lazy' in line:
                cover = line.split()[1][5:-12]
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
                    if title == "rkness-yamishib":
                        streams.pop("Funimation")
                        title = "Theatre of Darkness: Yamishibai"
                    elif title == "KING&amp;#x27;s RAID: Successors of the Will":
                        title = "KING's RAID: Successors of the Will"
                content = {
                    'day': day,
                    'time': time,
                    'cover': cover,
                    #'score': winner,
                    'streams': dict(sorted(streams.items(), key = lambda show: show[0]))
                }
                shows.update({unescape(title): content})
                streams = {}
        json.dump(shows, file, indent = 4)

def getData(url):
    return popen(f"curl -k {url} -H 'User-Agent: Firefox/60.'").read().split("\n")

def AnimeLab(url):
    Bools = [False, False]
    for line in getData(url):
        if Bools[0]:
            if Bools[1]:
                return line[1::]
            Bools[1] = True
        if "title" in line:
            Bools[0] = True

def Crunchyroll(url):
    for line in getData(url):
        if "title" in line:
            return line[70:-10]

def HiDive(url):
    for line in getData(url):
        if "title" in line:
            return line[35:-14]

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
