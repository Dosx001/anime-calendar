from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium import webdriver
from shows import shows
from sys import argv
from os import popen

def main():
    profile = popen('ls ~/.mozilla/firefox/ | grep "default"').read().split("\n")[1]
    user = popen("whoami").read()[0:-1]
    path = "/home/" + user + "/.mozilla/firefox/" + profile
    options = Options()
    options.set_preference('profile', path)
    sh = shows(webdriver.Firefox(service = Service(log_path = '/dev/null'),
        options = options))
    sh.html()
    if len(argv) == 1:
        sh.update()
    elif argv[1] == "n":
        sh.rename()
    else:
        sh.updateStreams()
    sh.driver.quit()

if __name__ == "__main__":
    main()
