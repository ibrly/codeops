import unittest

from playlist import describe_song


class TestDescribeSong(unittest.TestCase):
    def test_describes_a_song_with_its_length(self):
        self.assertEqual(describe_song({"title": "Outro", "seconds": 240}), "Outro (4:00)")

    def test_pads_the_seconds(self):
        self.assertEqual(describe_song({"title": "Intro", "seconds": 65}), "Intro (1:05)")


if __name__ == "__main__":
    unittest.main()
