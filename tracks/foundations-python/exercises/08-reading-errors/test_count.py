import unittest

from count import count_songs


class TestCountSongs(unittest.TestCase):
    def test_counts_the_songs(self):
        self.assertEqual(count_songs([{"title": "A"}, {"title": "B"}]), 2)

    def test_an_empty_playlist_has_0_songs(self):
        self.assertEqual(count_songs([]), 0)


if __name__ == "__main__":
    unittest.main()
