from os import popen
from sys import argv

from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service

from shows import Shows


def main():
    profile = popen('ls ~/.mozilla/firefox/ | grep "default"').read().split("\n")[1]
    path = "$HOME/.mozilla/firefox/" + profile
    options = Options()
    options.set_preference("profile", path)
    shw = Shows(
        webdriver.Firefox(service=Service(log_path="/dev/null"), options=options)
    )
    shw.driver.maximize_window()
    shw.html()
    if len(argv) == 1:
        shw.update()
    elif argv[1] == "n":
        shw.rename()
    else:
        shw.update_streams()
    shw.driver.quit()


if __name__ == "__main__":
    main()
