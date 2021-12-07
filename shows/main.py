from selenium import webdriver
from shows import shows
from sys import argv
from os import popen

def main():
    profile = popen('ls ~/.mozilla/firefox/ | grep "default"').read().split("\n")[1]
    user = popen("whoami").read()[0:-1]
    path = "/home/" + user + "/.mozilla/firefox/" + profile
    sh = shows(webdriver.Firefox(service_log_path = '/dev/null',
        firefox_profile = webdriver.FirefoxProfile(path)))
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
