from selenium import webdriver
from json import dump, load

def main():
    driver = webdriver.Firefox(service_log_path = '/dev/null',
        firefox_profile = webdriver.FirefoxProfile("/home/dosx/.mozilla/firefox/eg34u3uo.default"))
    driver.get('https://animeschedule.net/seasons/fall-2021')
    data = driver.find_element_by_class_name('shows-container').find_elements_by_class_name('show-tile')
    shows = {}
    for i, show in enumerate(data):
        title = show.find_element_by_class_name('show-title').get_attribute('innerHTML')
        cover = show.find_element_by_class_name('show-poster').get_attribute('src')
        while "placeholder" in cover:
            cover = show.find_element_by_class_name('show-poster').get_attribute('src')
        studio = show.find_element_by_class_name('poster-information-studio').get_attribute('innerHTML')
        source = show.find_element_by_class_name('poster-information-source').get_attribute('innerHTML')
        genres = [ele.get_attribute('innerHTML') for ele in show.find_elements_by_class_name('genre')]
        content = {
            'cover': cover[:-12:] + ("" if i < 3 else "?w=5&h=5"),
            'Studio': studio,
            'Source': source,
            'Genres': genres
            }
        shows.update({title: content})
    driver.quit()
    with open('indent.json', 'w') as file:
        dump(shows, file, indent = 4)
    with open('shows.json', 'w') as file:
        dump(shows, file, separators=(',', ':'))

if __name__ == "__main__":
    main()
