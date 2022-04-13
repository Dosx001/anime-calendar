from html import unescape
from json import dump, load
from os import popen, system
from time import strftime, strptime

from selenium import webdriver
from selenium.common.exceptions import (
    NoSuchElementException,
    StaleElementReferenceException,
)
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service


class Shows:
    def __init__(self, driver):
        if driver is None:
            profile = (
                popen('ls ~/.mozilla/firefox/ | grep "default"').read().split("\n")[1]
            )
            options = Options()
            options.set_preference("profile", "$HOME/.mozilla/firefox/" + profile)
            self.driver = webdriver.Firefox(
                service=Service(log_path="/dev/null"),
                options=options
            )
        else:
            self.driver = driver
        self.driver.maximize_window()
        with open("shows.json", encoding="utf-8") as file:
            self.shows = load(file)
        with open("keys.json", encoding="utf-8") as file:
            self.keys = load(file)
        self.static = {}
        self.changes = {}
        self.new = {}

    def html(self):
        self.driver.get("https://animeschedule.net")
        self.driver.refresh()
        for num, day in enumerate(
            [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            1,
        ):
            for col in self.driver.find_elements(By.CLASS_NAME, day):
                for show in col.find_elements(By.CLASS_NAME, "timetable-column-show"):
                    if show.get_attribute("chinese") is not None:
                        continue
                    title = show.find_element(
                        By.CLASS_NAME, "show-title-bar"
                    ).get_attribute("innerText")
                    time = (
                        show.find_element(By.CLASS_NAME, "show-air-time")
                        .get_attribute("innerText")
                        .strip()
                    )
                    if time[0] == "0":
                        time = time[1::]
                    cover = show.find_element(
                        By.CLASS_NAME, "show-poster"
                    ).get_attribute("data-src")
                    streams = {}
                    for stream in show.find_elements(By.CLASS_NAME, "stream-link"):
                        link = stream.get_attribute("href")
                        streams.update({stream.get_attribute("title"): link})
                    content = {
                        "day": num,
                        "time": time,
                        "cover": cover,
                        "streams": dict(
                            sorted(streams.items(), key=lambda show: show[0])
                        ),
                    }
                    if "Netflix" in content["streams"]:
                        content["streams"].pop("Netflix")
                    if title in self.keys:
                        if self.shows[self.keys[title]] == content:
                            self.static.update({title: None})
                        else:
                            self.changes.update({title: content})
                    else:
                        self.new.update({title: content})

    def title(self, show):
        for stream in self.new[show]["streams"]:
            match stream:
                # Geo Locked
                # case 'AnimeLab':
                #    title = self.animelab(self.new[show]['streams'][stream])
                case "Crunchyroll":
                    title = self.crunchyroll(self.new[show]["streams"][stream])
                case "Funimation":
                    title = self.funimation(self.new[show]["streams"][stream])
                    if title == "TIME_OUT":
                        continue
                case "HiDive":
                    title = self.hidive(self.new[show]["streams"][stream])
                case "Netflix":
                    title = self.netflix(self.new[show]["streams"][stream])
                case "VRV":
                    title = self.vrv(self.new[show]["streams"][stream])
                case "Wakanim":
                    title = self.wakanim(self.new[show]["streams"][stream])
                case _:
                    continue
            if title:
                while title != unescape(title):
                    title = unescape(title)
            else:
                continue
            return title
        return show

    def update(self):
        if (
            len(self.changes) != 0
            or len(self.new) != 0
            or len(self.static) != len(self.keys)
        ):
            system("cp shows.json past_shows.json")
            for show in list(self.keys):
                if show in self.changes:
                    self.shows[self.keys[show]] = self.changes[show]
                elif show not in self.static:
                    self.shows.pop(self.keys.pop(show))
            for show, info in self.new.items():
                title = self.title(show)
                self.shows.update({title: info})
                self.keys.update({show: title})
            with open("keys.json", "w", encoding="utf-8") as file:
                dump(self.keys, file, indent=2)
            with open("shows.json", "w", encoding="utf-8") as file:
                dump(self.shows, file, separators=(",", ":"))
            with open("indent.json", "w", encoding="utf-8") as file:
                dump(self.shows, file, indent=2)
            self.time()

    def time(self):
        system("cp time.json past_time.json")
        times = sorted(
            set(strptime(self.shows[show]["time"], "%I:%M %p") for show in self.shows)
        )
        min_time = times[0]
        max_time = times[-1]
        output = {}
        output.update({"compact": self.format_times(times)})
        times = set(times)
        for hour in range(1, 13):
            for time in ["00 AM", "30 AM", "00 PM", "30 PM"]:
                times.add(strptime(f"{hour}:{time}", "%I:%M %p"))
        times = sorted(times)
        full = list(times)
        output.update({"full": self.format_times(times)})
        times = [time for time in full if min_time <= time <= max_time]
        output.update({"cutoff": self.format_times(times)})
        with open("time.json", "w", encoding="utf-8") as file:
            dump(output, file, separators=(",", ":"))

    @staticmethod
    def format_times(times):
        output = []
        for time in times:
            time = strftime("%I:%M %p", time)
            output.append(time[1::] if time[0] == "0" else time)
        return output

    @staticmethod
    def get_data(url):
        pipe = popen(f"curl -k {url} -H 'User-Agent: Firefox/60.'")
        data = pipe.read().split("\n")
        pipe.close()
        return data

    def animelab(self, url):
        boolans = [False, False]
        for line in self.get_data(url):
            if boolans[0]:
                if boolans[1]:
                    return line[1::]
                boolans[1] = True
            elif "title" in line:
                boolans[0] = True
        return None

    def crunchyroll(self, url):
        self.driver.get(url)
        try:
            return (
                self.driver.find_element(By.CLASS_NAME, "ch-left")
                .find_element(By.TAG_NAME, "span")
                .text
            )
        except NoSuchElementException:
            with open("pass.txt", encoding="utf-8") as file:
                keys = file.readline().split()
            self.driver.find_element(By.CLASS_NAME, "submitbtn").click()
            self.driver.find_element(By.ID, "login_form_name").send_keys(keys[0])
            self.driver.find_element(By.ID, "login_form_password").send_keys(keys[1])
            self.driver.find_element(By.ID, "login_submit_button").click()
            while True:
                try:
                    text = (
                        self.driver.find_element(By.CLASS_NAME, "hero-heading-line")
                        .find_element(By.TAG_NAME, "h1")
                        .text
                    )
                    self.driver.find_element(
                        By.CLASS_NAME, "erc-authenticated-user-menu"
                    ).click()
                    self.driver.find_element(By.CLASS_NAME, "user-menu-sticky").click()
                    return text
                except NoSuchElementException:
                    pass

    def funimation(self, url):
        self.driver.get(url)
        try:
            for _ in range(200):
                try:
                    return self.driver.find_element(By.CLASS_NAME, "text-md-h1").text
                except NoSuchElementException:
                    pass
        except StaleElementReferenceException:
            pass
        return None

    def hidive(self, url):
        for line in self.get_data(url):
            if "title" in line:
                return line[35:-14]
        return None

    def netflix(self, url):
        title = []
        boolan = False
        if "/bg/" in url:
            url = url.replace("/bg", "")
        for line in self.get_data(url)[0].split(" "):
            if boolan:
                if line != "|":
                    title.append(line)
                else:
                    title = " ".join(title[1::])
                    if title == " ":
                        return None
                    return title
            elif "/><title>" in line:
                title.append(line[267::])
                boolan = True
        return None

    def vrv(self, url):
        boolans = [False, False]
        title = []
        for line in self.get_data(url):
            if boolans[0]:
                for item in line.split(" "):
                    if boolans[1]:
                        if '"/>' in item:
                            title.append(item.split('"/>')[0])
                            return " ".join(title)
                        title.append(item)
                    elif item == 'content="Watch':
                        boolans[1] = True
            elif "</script>" in line:
                boolans[0] = True
        return None

    def wakanim(self, url):
        self.driver.get(url)
        return self.driver.find_element(
            By.CLASS_NAME, "SerieHeader-thumb"
        ).get_attribute("alt")
