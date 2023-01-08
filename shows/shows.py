from html import unescape
from json import dump, load
from os import popen, system
from re import search
from time import sleep, strftime, strptime
from typing import TypedDict

from selenium import webdriver
from selenium.common.exceptions import (NoSuchElementException,
                                        StaleElementReferenceException)
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from typing_extensions import NotRequired


class ShowType(TypedDict):
    title: str
    day: int
    time: str
    cover: str
    streams: dict[str, str]
    status: NotRequired[bool]


class Shows:
    def __init__(self, driver: WebDriver | None = None):
        if driver:
            self.driver = driver
        else:
            profile = (
                popen("ls ~/.mozilla/firefox/ | grep default").read().split("\n")[1]
            )
            options = Options()
            options.set_preference("profile", "$HOME/.mozilla/firefox/" + profile)
            self.driver = webdriver.Firefox(
                service=Service(log_path="/dev/null"), options=options
            )
        self.driver.maximize_window()
        with open("shows.json", encoding="utf-8") as file:
            self.shows: dict[str, ShowType] = load(file)
        self.num = len(self.shows)
        self.status = False
        self.static: dict[str, None] = {}
        self.changes: dict[str, ShowType] = {}
        self.new: dict[str, ShowType] = {}

    def html(self):
        show: WebElement
        self.driver.get("https://animeschedule.net")
        self.driver.find_element(By.ID, "timetable-filters-filter-popularity").click()
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
                    if show.get_attribute("chinese") or search(
                        "hidden|filtered-out", show.get_attribute("class")
                    ):
                        continue
                    title = show.find_element(
                        By.CLASS_NAME, "show-title-bar"
                    ).get_attribute("innerText")
                    key = show.get_attribute("showid")
                    time = (
                        show.find_element(By.CLASS_NAME, "show-air-time")
                        .get_attribute("innerText")
                        .strip()
                    )
                    if time[0] == "0":
                        time = time[1::]
                    cover = show.find_element(
                        By.CLASS_NAME, "show-poster"
                    ).get_attribute("data-src")[77:-4]
                    streams = {
                        stream.get_attribute("title"): stream.get_attribute("href")
                        for stream in show.find_elements(By.CLASS_NAME, "stream-link")
                    }
                    content: ShowType = {
                        "title": self.shows[key]["title"]
                        if key in self.shows
                        else title,
                        "day": num,
                        "time": time,
                        "cover": cover,
                        "streams": dict(
                            sorted(streams.items(), key=lambda show: show[0])
                        ),
                    }
                    if key in self.shows:
                        check = dict(self.shows[key])
                        if "status" in check:
                            check.pop("status")
                        if check == content:
                            self.static.update({key: None})
                        else:
                            self.changes.update({key: content})
                    else:
                        self.new.update({key: content})

    def title(self, key: str, new: bool) -> str:
        data = self.new if new else self.changes
        for stream in data[key]["streams"]:
            match stream:
                # Geo Locked
                # case 'AnimeLab':
                #    title = self.animelab(data[show]['streams'][stream])
                case "Crunchyroll":
                    title = self.crunchyroll(data[key]["streams"][stream])
                case "Funimation":
                    title = self.funimation(data[key]["streams"][stream])
                    if title == "TIME_OUT":
                        continue
                case "HiDive":
                    title = self.hidive(data[key]["streams"][stream])
                case "Hulu":
                    title = self.hulu(data[key]["streams"][stream])
                case "Netflix":
                    title = self.netflix(data[key]["streams"][stream])
                case "VRV":
                    title = self.vrv(data[key]["streams"][stream])
                case "Wakanim":
                    title = self.wakanim(data[key]["streams"][stream])
                case _:
                    continue
            if title:
                while title != unescape(title):
                    title = unescape(title)
                return str(title)
        self.status = True
        return data[key]["title"]

    def update(self):
        if len(self.changes) != 0 or len(self.new) != 0 or len(self.static) != self.num:
            system("cp shows.json past_shows.json")
            for key in list(self.shows):
                if key in self.changes:
                    if "status" in self.shows[key]:
                        self.changes[key]["title"] = self.title(key, False)
                    if self.status:
                        self.changes[key]["status"] = True
                        self.status = False
                    self.shows[key] = self.changes[key]
                elif key not in self.static:
                    self.shows.pop(key)
            for key, data in self.new.items():
                data["title"] = self.title(key, True)
                if self.status:
                    data["status"] = True
                    self.status = False
                self.shows.update({key: data})
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
    def format_times(times: list) -> list[str]:
        output = []
        for time in times:
            time = strftime("%I:%M %p", time)
            output.append(time[1::] if time[0] == "0" else time)
        return output

    @staticmethod
    def get_data(url: str) -> list[str]:
        pipe = popen(f"curl -k {url} -H 'User-Agent: Firefox/60.'")
        data = pipe.read().split("\n")
        pipe.close()
        return data

    def animelab(self, url: str) -> str | None:
        boolans = [False, False]
        for line in self.get_data(url):
            if boolans[0]:
                if boolans[1]:
                    return line[1::]
                boolans[1] = True
            elif "title" in line:
                boolans[0] = True
        return None

    def crunchyroll(self, url: str) -> str | None:
        self.driver.get(url)
        try:
            return self.driver.find_element(By.CLASS_NAME, "hero-heading-line").text
        except NoSuchElementException:
            with open("pass.txt", encoding="utf-8") as file:
                keys = file.readline().split()
            self.driver.find_element(By.CLASS_NAME, "submitbtn").click()
            self.driver.find_element(By.ID, "login_form_name").send_keys(keys[0])
            self.driver.find_element(By.ID, "login_form_password").send_keys(keys[1])
            self.driver.find_element(By.ID, "login_submit_button").click()
            while True:
                try:
                    text = self.driver.find_element(
                        By.CLASS_NAME, "hero-heading-line"
                    ).text
                    self.driver.find_element(
                        By.CLASS_NAME, "erc-authenticated-user-menu"
                    ).click()
                    self.driver.find_element(By.CLASS_NAME, "user-menu-sticky").click()
                    return text
                except NoSuchElementException:
                    sleep(0.1)

    def funimation(self, url: str) -> str | None:
        self.driver.get(url)
        try:
            while True:
                try:
                    return self.driver.find_element(By.CLASS_NAME, "text-md-h1").text
                except NoSuchElementException:
                    sleep(0.1)
        except StaleElementReferenceException:
            pass
        return None

    def hidive(self, url: str) -> str | None:
        self.driver.get(url)
        text = (
            self.driver.find_element(By.ID, "showInfoPage")
            .find_element(By.TAG_NAME, "a")
            .get_property("text")
        )
        return text if isinstance(text, str) else None

    def hulu(self, url: str) -> str | None:
        self.driver.get(url)
        self.driver.find_element(By.CLASS_NAME, "nav__items").find_elements(
            By.TAG_NAME, "a"
        ).pop().click()
        return self.driver.find_element(By.CLASS_NAME, "CollectionDetails__title").text

    def netflix(self, url: str) -> str | None:
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

    def vrv(self, url: str) -> str | None:
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

    def wakanim(self, url: str) -> str | None:
        self.driver.get(url)
        return self.driver.find_element(
            By.CLASS_NAME, "SerieHeader-thumb"
        ).get_attribute("alt")
