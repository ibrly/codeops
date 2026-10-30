import unittest

from average import average_duration


class TestAverageDuration(unittest.TestCase):
    def test_averages_the_song_lengths(self):
        playlist = [{"seconds": 100}, {"seconds": 200}, {"seconds": 300}]
        self.assertEqual(average_duration(playlist), 200)

    def test_an_empty_playlist_averages_to_0(self):
        self.assertEqual(average_duration([]), 0)


if __name__ == "__main__":
    unittest.main()
