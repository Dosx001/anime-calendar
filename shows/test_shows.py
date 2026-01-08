import unittest

from shows import Shows


class TestList(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.shw = Shows()

    @classmethod
    def tearDownClass(cls):
        cls.shw.driver.quit()

    def test_apple(self):
        title = self.shw.apple("https://apple.co/45GJVqx")
        self.assertEqual(title, "Journal with witch")

    def test_crunchyroll(self):
        title = self.shw.crunchyroll("https://www.crunchyroll.com/attack-on-titan")
        self.assertEqual(title, "Attack on Titan")

    def test_hidive(self):
        title = self.shw.hidive("https://www.hidive.com/season/22306")
        self.assertEqual(title, "Urusei Yatsura")

    def test_hulu(self):
        title = self.shw.hulu(
            "https://www.hulu.com/series/02a3c8c0-4f1d-4610-bbb4-5b8e9468d7b1"
        )
        self.assertEqual(title, "BLEACH: Thousand-Year Blood War")

    def test_netflix(self):
        title = self.shw.netflix("https://www.netflix.com/title/80050063")
        self.assertEqual(title, "The Seven Deadly Sins")

    def test_netflix2(self):
        title = self.shw.netflix("https://www.netflix.com/bg/title/81239555")
        self.assertEqual(title, "SHAMAN KING")


if __name__ == "__main__":
    unittest.main()
