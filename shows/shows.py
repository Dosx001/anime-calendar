from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException
from selenium.webdriver.common.by import By
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
        self.driver.get("https://animeschedule.net")
        for num, day in enumerate(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], 1):
            for col in self.driver.find_elements(By.CLASS_NAME, day):
                for show in col.find_elements(By.CLASS_NAME, "timetable-column-show"):
                    if show.get_attribute("chinese") != None:
                        continue
                    title = show.find_element(By.CLASS_NAME, "show-title-bar").get_attribute("innerHTML")
                    time = show.find_element(By.CLASS_NAME, "show-air-time").get_attribute("innerHTML")
                    if time[0] == "0":
                        time = time[1::]
                    cover = show.find_element(By.CLASS_NAME, "show-poster").get_attribute("data-src")[0:-12]
                    streams = {}
                    for stream in show.find_elements(By.CLASS_NAME, "stream-link"):
                        link = stream.get_attribute('href')
                        streams.update({stream.get_attribute('title') : link})
                    content = {
                        'day': num,
                        'time': time,
                        'cover': cover,
                        'streams': dict(sorted(streams.items(), key = lambda show: show[0]))
                    }
                    if title in self.keys:
                        if "Netflix" in content['streams']:
                            content['streams'].pop("Netflix")
                        if self.shows[self.keys[title]] == content:
                            self.static.update({title: None})
                        else:
                            self.changes.update({title: content})
                    else:
                        self.new.update({title: content})

    def title(self, show):
        for stream in self.new[show]['streams']:
            match stream:
                # Geo Locked
                #case 'AnimeLab':
                #    title = self.AnimeLab(self.new[show]['streams'][stream])
                case 'Crunchyroll':
                    title = self.Crunchyroll(self.new[show]['streams'][stream])
                case 'Funimation':
                    title = self.Funimation(self.new[show]['streams'][stream])
                    if title == 'TIME_OUT':
                        continue
                case 'HiDive':
                    title = self.HiDive(self.new[show]['streams'][stream])
                case 'Netflix':
                    title = self.Netflix(self.new[show]['streams'][stream])
                case 'VRV':
                    title = self.VRV(self.new[show]['streams'][stream])
                case 'Wakanim':
                    title = self.Wakanim(self.new[show]['streams'][stream])
                case _:
                    continue
            while title != unescape(title):
                title = unescape(title)
            return title

    def update(self):
        if len(self.changes) != 0 or len(self.new) != 0 or len(self.static) != len(self.keys):
            system("cp shows.json past_shows.json")
            for show in list(self.keys):
                if show in self.changes:
                    self.shows[self.keys[show]] = self.changes[show]
                elif not show in self.static:
                    self.shows.pop(self.keys.pop(show))
            for show in self.new:
                title = self.title(show)
                self.shows.update({title: self.new[show]})
                self.keys.update({show: title})
            with open('keys.json', 'w') as file:
                dump(self.keys, file, indent = 4)
            with open('shows.json', 'w') as file:
                dump(self.shows, file, separators=(',', ':'))
            with open('indent.json', 'w') as file:
                dump(self.shows, file, indent = 4)
            self.time()

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
        pipe = popen(f"curl -k {url} -H 'User-Agent: Firefox/60.'")
        data = pipe.read().split("\n")
        pipe.close()
        return data

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
            return self.driver.find_element(By.CLASS_NAME, "ch-left").find_element(By.TAG_NAME, "span").text
        except NoSuchElementException:
            with open("pass.txt") as f:
                keys = f.readline().split()
            self.driver.find_element(By.CLASS_NAME, "submitbtn").click()
            self.driver.find_element(By.ID, "login_form_name").send_keys(keys[0])
            self.driver.find_element(By.ID, "login_form_password").send_keys(keys[1])
            self.driver.find_element(By.ID, "login_submit_button").click()
            while True:
                try:
                    text = self.driver.find_element(By.CLASS_NAME, 'hero-heading-line').find_element(By.TAG_NAME, "h1").text
                    self.driver.find_element(By.CLASS_NAME, "erc-authenticated-user-menu").click()
                    self.driver.find_element(By.CLASS_NAME, "user-menu-sticky").click()
                    return text
                except NoSuchElementException:
                    pass

    def Funimation(self, url):
        self.driver.get(url)
        try:
            for _ in range(200):
                try:
                    return self.driver.find_element(By.CLASS_NAME, "text-md-h1").text
                except NoSuchElementException:
                    pass
        except StaleElementReferenceException:
            pass
        return "TIME_OUT"

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
                    return " ".join(title[1::])
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
        return self.driver.find_element(By.CLASS_NAME, "SerieHeader-thumb").get_attribute("alt")

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
