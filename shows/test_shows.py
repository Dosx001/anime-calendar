import unittest
from os import popen

from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service

from shows import Shows

profile = popen('ls ~/.mozilla/firefox/ | grep "default"').read().split("\n")[1]
options = Options()
options.set_preference("profile", "$HOME/.mozilla/firefox/" + profile)
driver = webdriver.Firefox(service=Service(log_path="/dev/null"), options=options)


class TestList(unittest.TestCase):
    def setUp(self):
        self.shw = Shows(driver)

    # def test_animelab(self):
    #    title = self.shw.animelab("https://www.animelab.com/shwows/log-horizon")
    #    self.assertEqual(title, "Log Horizon")

    def test_crunchyroll(self):
        title = self.shw.crunchyroll("https://www.crunchyroll.com/attack-on-titan")
        self.assertEqual(title, "Attack on Titan")

    def test_funimation(self):
        title = self.shw.funimation(
            "https://www.funimation.com/shows/the-detective-is-already-dead/"
        )
        self.assertEqual(title, "The Detective Is Already Dead")

    def test_hidive(self):
        title = self.shw.hidive("https://www.hidive.com/movies/tamako-love-story-")
        self.assertEqual(title, "Tamako-love story-")

    def test_hulu(self):
        title = self.shw.hulu(
            "https://www.hulu.com/series/bleach-thousand-year-blood-war-02a3c8c0-4f1d-4610-bbb4-5b8e9468d7b1"
        )
        self.assertEqual(title, "Bleach: Thousand-Year Blood War")

    def test_netflix(self):
        title = self.shw.netflix("https://www.netflix.com/title/80050063")
        self.assertEqual(title, "The Seven Deadly Sins")

    def test_netflix2(self):
        title = self.shw.netflix("https://www.netflix.com/bg/title/81239555")
        self.assertEqual(title, "SHAMAN KING")

    def test_vrv(self):
        title = self.shw.vrv("https://vrv.co/series/GG5H5X7ZE")
        self.assertEqual(title, "Koikimo")

    def test_vrv2(self):
        title = self.shw.vrv("https://vrv.co/series/G6NQ5DWZ6/My-Hero-Academia")
        self.assertEqual(title, "My Hero Academia")

    def test_wakanim(self):
        title = self.shw.wakanim(
            "https://www.wakanim.tv/sc/v2/catalogue/show/1203/horimiya"
        )
        self.assertEqual(title, "Horimiya")
        self.shw.driver.quit()


if __name__ == "__main__":
    unittest.main()
