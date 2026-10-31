import unittest

from load import load_songs


class TestLoadSongs(unittest.TestCase):
    def test_keeps_every_good_line_and_counts_the_bad_one(self):
        result = load_songs(["Intro,60", "oops", "Outro,30"])
        self.assertEqual(result["songs"], [{"title": "Intro", "seconds": 60}, {"title": "Outro", "seconds": 30}])
        self.assertEqual(result["skipped"], 1)

    def test_counts_every_bad_line(self):
        self.assertEqual(load_songs(["bad", "worse", "Ok,10"])["skipped"], 2)

    def test_all_good_lines_means_nothing_skipped(self):
        self.assertEqual(load_songs(["A,1"]), {"songs": [{"title": "A", "seconds": 1}], "skipped": 0})


if __name__ == "__main__":
    unittest.main()
