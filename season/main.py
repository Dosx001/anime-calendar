from json import dump
from os import popen

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.remote.webelement import WebElement


def main():
    profile = popen('ls ~/.mozilla/firefox/ | grep "default"').read().split("\n")[0]
    user = popen("whoami").read()[0:-1]
    options = Options()
    options.set_preference("profile", "/home/" + user + "/.mozilla/firefox/" + profile)
    driver = webdriver.Firefox(
        service=Service(executable_path="/usr/bin/geckodriver", log_path="/dev/null"),
        options=options,
    )
    driver.maximize_window()
    driver.get("https://animeschedule.net/seasons/summer-2025")
    shows = {}
    show: WebElement
    for show in driver.find_element(By.CLASS_NAME, "shows-container").find_elements(
        By.CLASS_NAME, "anime-tile"
    ):
        title = show.find_element(By.CLASS_NAME, "anime-tile-title").text
        cover = show.find_element(By.CLASS_NAME, "anime-tile-thumbnail")
        cover = cover.get_dom_attribute("src")
        # while "placeholder" in cover:
        #     cover = show.find_element(By.CLASS_NAME, 'show-poster').get_dom_attribute('src')
        try:
            studio = show.find_element(By.CLASS_NAME, "anime-tile-stu").text
        except NoSuchElementException:
            studio = "N/A"
        source = show.find_element(By.CLASS_NAME, "anime-tile-sou").text
        genres = [
            ele.accessible_name
            for ele in show.find_elements(By.CLASS_NAME, "anime-tile-genre")
        ]
        content = {
            "title": title,
            "cover": cover[77:-4],
            "studio": studio,
            "source": source,
            "genres": genres,
        }
        shows.update({show.get_dom_attribute("showid"): content})
    shows = dict(sorted(shows.items(), key=lambda item: item[1]["title"]))
    with open("indent.json", "w", encoding="utf-8") as file:
        dump(shows, file, indent=2)
    with open("shows.json", "w", encoding="utf-8") as file:
        dump(shows, file, separators=(",", ":"))
    driver.quit()


if __name__ == "__main__":
    main()
