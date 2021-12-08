from selenium import webdriver
from json import dump, load
from os import popen

def main():
    profile = popen('ls ~/.mozilla/firefox/ | grep "default"').read().split("\n")[1]
    user = popen("whoami").read()[0:-1]
    path = "/home/" + user + "/.mozilla/firefox/" + profile
    driver = webdriver.Firefox(service_log_path = '/dev/null',
        firefox_profile = webdriver.FirefoxProfile(path))
    driver.get('https://animeschedule.net/seasons/winter-2022')
    data = driver.find_element_by_class_name('shows-container').find_elements_by_class_name('anime-tile')
    shows = {}
    for show in data:
        title = show.find_element_by_class_name('anime-tile-title').get_attribute('innerHTML')
        cover = show.find_element_by_class_name('anime-tile-thumbnail').get_attribute('src')
        while "placeholder" in cover:
            cover = show.find_element_by_class_name('show-poster').get_attribute('src')
        try:
            studio = show.find_element_by_class_name('anime-tile-stu').get_attribute('innerHTML')
        except:
            studio = "N/A"
        source = show.find_element_by_class_name('anime-tile-sou').get_attribute('innerHTML')
        genres = [ele.get_attribute('innerHTML') for ele in show.find_elements_by_class_name('anime-tile-genre')]
        content = {
            'cover': cover[:-12],
            'Studio': studio,
            'Source': source,
            'Genres': genres
            }
        shows.update({title: content})
    driver.quit()
    shows = dict(sorted(shows.items()))
    with open('indent.json', 'w') as file:
        dump(shows, file, indent = 4)
    with open('shows.json', 'w') as file:
        dump(shows, file, separators=(',', ':'))

if __name__ == "__main__":
    main()
