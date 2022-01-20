import unittest

from selenium import webdriver
from selenium.webdriver.firefox.service import Service

from shows import Shows

driver = webdriver.Firefox(service=Service(log_path="/dev/null"))


class TestList(unittest.TestCase):
    def setUp(self):
        self.shw = Shows()

    # def test_animelab(self):
    #    title = self.shw.animelab("https://www.animelab.com/shwows/log-horizon")
    #    self.assertEqual(title, "Log Horizon")

    def test_crunchyroll(self):
        self.shw.driver = driver
        title = self.shw.crunchyroll("https://www.crunchyroll.com/attack-on-titan")
        self.assertEqual(title, "Attack on Titan")

    def test_funimation(self):
        self.shw.driver = driver
        title = self.shw.funimation(
            "https://www.funimation.com/shwows/the-detective-is-already-dead/"
        )
        self.assertEqual(title, "The Detective Is Already Dead")

    def test_hidive(self):
        title = self.shw.hidive("https://www.hidive.com/tv/non-non-biyori-nonstop")
        self.assertEqual(title, "Non Non Biyori Nonstop")

    def test_netflix(self):
        title = self.shw.netflix("https://www.netflix.com/title/80050063")
        self.assertEqual(title, "The Seven Deadly Sins")

    def test_netflix2(self):
        title = self.shw.netflix("https://www.netflix.com/bg/title/81239555")
        self.assertEqual(title, "SHAMAN KING")

    def test_vrv(self):
        title = self.shw.vrv("https://vrv.co/series/gg5h5x7ze")
        self.assertEqual(title, "Koikimo")

    def test_vrv2(self):
        title = self.shw.vrv("https://vrv.co/series/g6nq5dwz6/my-hero-academia")
        self.assertEqual(title, "My Hero Academia")

    def test_wakanim(self):
        self.shw.driver = driver
        title = self.shw.wakanim(
            "https://www.wakanim.tv/sc/v2/catalogue/shwow/1203/horimiya"
        )
        self.assertEqual(title, "Horimiya")
        self.shw.driver.quit()


if __name__ == "__main__":
    unittest.main()
