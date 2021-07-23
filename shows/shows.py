from selenium.common.exceptions import NoSuchElementException
from time import strftime, strptime
from json import dump, load
from html import unescape
from os import popen, system

class shows:
    def __init__(self, driver = None):
        self.driver = driver
        with open('shows.json') as f:
            self.shows = load(f)
        with open('keys.json') as f:
            self.keys = load(f)
        self.static = {}
        self.changes = {}
        self.new = {}

    def html(self):
        with open('code.html') as f:
            source = f.readlines()
        streams = {}
        check = [False, False]
        for line in source:
            if "timetable-column-day" in line:
                day = line[170:-13]
            elif "timetable-column-show" in line:
                check[0] = False if "hide" in line else True
            if check[1]:
                time = line[4:-1]
                if len(time) == 9:
                    time = time[1::]
                if time[0] == "0":
                    time = time[1::]
                check[1] = False
            elif check[0]:
                if "show-air-time" in line:
                    check[1] = True
                elif 'show-poster' in line and not 'lazy' in line:
                    cover = line.split()[2][5:-12]
                    if cover[-3::] != "jpg":
                        cover = cover[0:-4]
                elif 'class="stream-link"' in line and 'title' in line:
                    stream = line.split()
                    streams.update({stream[6][7:-1]:stream[1][6:-1]})
                elif "show-title-bar" in line and not "OVA" in line:
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
                    if title in self.keys:
                        if "Netflix" in content['streams']:
                            content['streams'].pop("Netflix")
                        if self.shows[self.keys[title]] == content:
                            self.static.update({title: None})
                        else:
                            self.changes.update({title: content})
                    else:
                        self.new.update({title: content})

    def update(self):
        if len(self.changes) != 0 or len(self.new) != 0 or len(self.static) != len(self.keys):
            system("cp shows.json past_shows.json")
            for show in list(self.keys):
                if show in self.changes:
                    self.shows[self.keys[show]] = self.changes[show]
                elif not show in self.static:
                    self.shows.pop(self.keys.pop(show))
            getTitle = {
                'AnimeLab': lambda url: self.AnimeLab(url),
                'Crunchyroll': lambda url: self.Crunchyroll(url),
                'Funimation': lambda url: self.Funimation(url),
                'HiDive': lambda url: self.HiDive(url),
                'Netflix': lambda url: self.Netflix(url),
                'VRV': lambda url: self.VRV(url),
                'Wakanim': lambda url: self.Wakanim(url)
            }
            for show in self.new:
                for stream in self.new[show]['streams']:
                    if stream in getTitle:
                        title = self.show(getTitle, show, stream)
                        break
                else:
                    print(show)
                    print(self.new[show]['streams'])
                    In = input('title? ')
                    title = In if In != "" else show
                self.shows.update({title: self.new[show]})
                self.keys.update({show: title})
            with open('keys.json', 'w') as file:
                dump(self.keys, file, indent = 4)
            with open('shows.json', 'w') as file:
                dump(self.shows, file, separators=(',', ':'))
            with open('indent.json', 'w') as file:
                dump(self.shows, file, indent = 4)
            self.time()

    def show(self, getTitle, show, stream):
        title = getTitle[stream](self.new[show]['streams'][stream])
        if title != None:
            while title != unescape(title):
                title = unescape(title)
            if stream == "Netflix":
                self.new[show]['streams'].pop("Netflix")
        return title

    def time(self):
        output = {}
        system("cp time.json past_time.json")
        times = sorted(set(strptime(self.shows[show]['time'], "%I:%M %p") for show in self.shows))
        Min = times[0]
        Max = times[-1]
        self.getTimes(times)
        output.update({"compact": times})
        times = set(times)
        for time in range(1, 13):
            times.add(f"{time}:00 AM")
            times.add(f"{time}:30 AM")
            times.add(f"{time}:00 PM")
            times.add(f"{time}:30 PM")
        times = sorted([strptime(time, "%I:%M %p") for time in times])
        full = list(times)
        self.getTimes(times)
        output.update({"full": times})
        times = [time for time in full if Min <= time <= Max]
        self.getTimes(times)
        output.update({"cutoff": times})
        with open('time.json', 'w') as file:
            dump(output, file,separators=(',', ':'))

    def getTimes(self, times):
        for i in range(len(times)):
            time = strftime("%I:%M %p", times[i])
            if time[0] == "0":
                times[i] = time[1::]
            else:
                times[i] = time

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
        self.driver.get(url)
        try:
            ele = self.driver.find_element_by_class_name("ch-left")
            return ele.find_element_by_tag_name("span").text
        except NoSuchElementException:
            with open("pass.txt") as f:
                keys = f.readline().split()
            self.driver.find_element_by_class_name("submitbtn").click()
            self.driver.find_element_by_id("login_form_name").send_keys(keys[0])
            self.driver.find_element_by_id("login_form_password").send_keys(keys[1])
            self.driver.find_element_by_id("login_submit_button").click()
            while True:
                try:
                    text = self.driver.find_element_by_class_name('hero-heading-line').find_element_by_tag_name("h1").text
                    break
                except NoSuchElementException:
                    pass
            self.driver.find_element_by_class_name("erc-authenticated-user-menu").click()
            self.driver.find_element_by_class_name("user-menu-sticky").click()
            return text

    def Funimation(self, url):
        self.driver.get(url)
        while True:
            try:
                ele = self.driver.find_element_by_class_name("text-md-h1")
                return ele.text
            except NoSuchElementException:
                pass

    def HiDive(self, url):
        for line in self.getData(url):
            if "title" in line:
                return line[35:-14]

    def Netflix(self, url):
        title = []
        Bool = False
        if "/bg/" in url:
            url = url.replace("/bg", "")
        for line in self.getData(url)[0].split(" "):
            if Bool:
                if line != "|":
                    title.append(line)
                else:
                    return " ".join(title)
            elif "/><title>" in line:
                title.append(line[267::])
                Bool = True

    def VRV(self, url):
        Bools = [False, False]
        title = []
        for line in self.getData(url):
            if Bools[0]:
                for item in line.split(" "):
                    if Bools[1]:
                        if '"/>' in item:
                            title.append(item.split('"/>')[0])
                            return " ".join(title)
                        else:
                            title.append(item)
                    elif item == 'content="Watch':
                        Bools[1] = True
            elif "</script>" in line:
                Bools[0] = True

    def Wakanim(self, url):
        self.driver.get(url)
        ele = self.driver.find_element_by_class_name("SerieHeader-thumb")
        return ele.get_attribute("alt")

    def updateStreams(self):
        for show in self.changes:
            self.shows[self.keys[show]]['streams'] = self.changes[show]['streams']
        with open('shows.json', 'w') as file:
            dump(self.shows, file, separators=(',', ':'))
        with open('indent.json', 'w') as file:
            dump(self.shows, file, indent = 4)

    def rename(self):
        with open('names.json') as f:
            names = load(f)
        for name in names:
            if names[name] != self.keys[name]:
                self.shows.update({names[name] : self.shows.pop(self.keys[name])})
                self.keys[name] = names[name]
        with open('keys.json', 'w') as file:
            dump(self.keys, file, indent = 4)
        with open('shows.json', 'w') as file:
            dump(self.shows, file, separators=(',', ':'))
        with open('indent.json', 'w') as file:
            dump(self.shows, file, indent = 4)
