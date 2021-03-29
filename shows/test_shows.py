from shows import shows
import unittest

class TestList(unittest.TestCase):
    def setUp(self):
        self.sh = shows()

    def testAnimeLab(self):
        title = self.sh.AnimeLab("https://www.animelab.com/shows/log-horizon")
        self.assertTrue(title, "Log Horizon")

    def testCrunchyroll(self):
        title = self.sh.Crunchyroll("https://www.crunchyroll.com/attack-on-titan")
        print(title)
        self.assertTrue(title, "Attack on Titan")

    def testHiDive(self):
        title = self.sh.HiDive("https://www.hidive.com/tv/non-non-biyori-nonstop")
        self.assertTrue(title, "Non Non Biyori")

    def testNetflix(self):
        title = self.sh.Netflix("https://www.netflix.com/title/80050063")
        self.assertTrue(title, "The Seven Deadly Sins")

if __name__ == '__main__':
    unittest.main()
