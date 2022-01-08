from selenium.webdriver.firefox.service import Service
from selenium import webdriver
from shows import shows
import unittest

driver = webdriver.Firefox(service = Service(log_path = '/dev/null'))

class TestList(unittest.TestCase):
    def setUp(self):
        self.sh = shows()

    #def testAnimeLab(self):
    #    title = self.sh.AnimeLab("https://www.animelab.com/shows/log-horizon")
    #    self.assertEqual(title, "Log Horizon")

    def testCrunchyroll(self):
        self.sh.driver = driver
        title = self.sh.Crunchyroll("https://www.crunchyroll.com/attack-on-titan")
        self.assertEqual(title, "Attack on Titan")

    def testFunimation(self):
        self.sh.driver = driver
        title = self.sh.Funimation("https://www.funimation.com/shows/the-detective-is-already-dead/")
        self.assertEqual(title, "The Detective Is Already Dead")

    def testHiDive(self):
        title = self.sh.HiDive("https://www.hidive.com/tv/non-non-biyori-nonstop")
        self.assertEqual(title, "Non Non Biyori Nonstop")

    def testNetflix(self):
        title = self.sh.Netflix("https://www.netflix.com/title/80050063")
        self.assertEqual(title, "The Seven Deadly Sins")

    def testNetflix2(self):
        title = self.sh.Netflix("https://www.netflix.com/bg/title/81239555")
        self.assertEqual(title, "SHAMAN KING")

    def testVRV(self):
        title = self.sh.VRV("https://vrv.co/series/GG5H5X7ZE")
        self.assertEqual(title, "Koikimo")

    def testVRV2(self):
        title = self.sh.VRV("https://vrv.co/series/G6NQ5DWZ6/My-Hero-Academia")
        self.assertEqual(title, "My Hero Academia")

    def testWakanim(self):
        self.sh.driver = driver
        title = self.sh.Wakanim("https://www.wakanim.tv/sc/v2/catalogue/show/1203/horimiya")
        self.assertEqual(title, "Horimiya")
        self.sh.driver.quit()

if __name__ == '__main__':
    unittest.main()
