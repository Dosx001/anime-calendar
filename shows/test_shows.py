from shows import shows
import unittest

class TestList(unittest.TestCase):
    def setUp(self):
        self.sh = shows()

    def testAnimeLab(self):
        title = self.sh.AnimeLab("https://www.animelab.com/shows/log-horizon")
        self.assertEqual(title, "Log Horizon")

    #def testCrunchyroll(self):
    #    title = self.sh.Crunchyroll("https://www.crunchyroll.com/attack-on-titan")
    #    print(title)
    #    self.assertEqual(title, "Attack on Titan")

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

if __name__ == '__main__':
    unittest.main()
