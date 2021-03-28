import json
from os import popen, system
from html import unescape

class shows:
    def __init__(self):
        with open('shows.json') as f:
            self.shows = json.load(f)
        with open('keys.json') as f:
            self.keys = json.load(f)
        self.static = {}
        self.changes = {}
        self.new = {}

    def html(self):
        with open('code.html') as f:
            source = f.readlines()
        streams = {}
        for line in source:
            if "timetable-column-day" in line:
                day = line[77:-6]
            elif "show-air-time" in line:
                time = line[32:-8]
            elif 'show-poster' in line and not 'lazy' in line:
                cover = line.split()[1][5:-12]
                if cover[-3::] != "jpg":
                    cover = cover[0:-4]
            elif 'class="stream-link"' in line and 'title' in line:
                stream = line.split()
                streams.update({stream[6][7:-1]:stream[1][6:-1]})
            elif "show-title-bar" in line:
                title = line.split()[1::]
                title[0] = title[0][23::]
                title[-1] = title[-1][0:-5]
                title = unescape(" ".join(title))
                content = {
                    'day': day,
                    'time': time,
                    'cover': cover,
                    'streams': dict(sorted(streams.items(), key = lambda show: show[0]))
                }
                streams = {}
                try:
                    if self.shows[self.keys[title]] == content:
                        self.static.update({title: None})
                    else:
                        self.changes.update({title: content})
                except KeyError:
                    self.new.update({title: content})

    def update(self):
        if len(self.changes) != 0 or len(self.new) != 0 or len(self.static) != len(self.keys):
            system("cp shows.json last.json")
            for show in [show for show in self.keys if not (show in self.changes or show in self.static)]:
                self.shows.pop(self.keys.pop(show))
            for show in self.changes:
                if "Netflix" in self.changes[show]['streams']:
                    self.changes[show]['streams'].pop("Netflix")
                self.shows[self.keys[show]] = self.changes[show]
            getTitle = {
                'AnimeLab': lambda url: self.AnimeLab(url),
                'Crunchyroll': lambda url: self.Crunchyroll(url),
                'HiDive': lambda url: self.HiDive(url),
                'Netflix': lambda url: self.Netflix(url),
            }
            for show in self.new:
                for stream in getTitle:
                    if stream in self.new[show]['streams']:
                        title = getTitle[stream](self.new[show]['streams'][stream])
                        if stream == "Netflix":
                            self.new[show]['streams'].pop("Netflix")
                        self.shows.update({title: self.new[show]})
                        self.keys.update({show: title})
                        break
            try:
                self.fix()
            except IndexError:
                pass
            with open('keys.json', 'w') as file:
                json.dump(self.keys, file, indent=4)
            with open('shows.json', 'w') as file:
                json.dump(self.shows, file, separators=(',', ':'))
            with open('indent.json', 'w') as file:
                json.dump(self.shows, file, indent = 4)

    def getData(self, url):
        return popen(f"curl -k {url} -H 'User-Agent: Firefox/60.'").read().split("\n")

    def AnimeLab(self, url):
        Bools = [False, False]
        for line in self.getData(url):
            if Bools[0]:
                if Bools[1]:
                    return line[1::]
                Bools[1] = True
            if "title" in line:
                Bools[0] = True

    def Crunchyroll(self, url):
        for line in self.getData(url):
            if "title" in line:
                return line[70:-10]

    def HiDive(self, url):
        for line in self.getData(url):
            if "title" in line:
                return line[35:-14]

    def Netflix(self, url):
        title = []
        Bool = False
        for line in self.getData(url)[0].split(" "):
            if Bool:
                if line != "|":
                    title.append(line)
                else:
                    return " ".join(title)
            elif "/><title>" in line:
                title.append(line[267::])
                Bool = True

    def fix(self):
        self.shows["Theatre of Darkness: Yamishibai"]["streams"].pop("Funimation")
        self.shows["World Trigger"]["time"] = self.shows["World Trigger"]["time"][1::]
