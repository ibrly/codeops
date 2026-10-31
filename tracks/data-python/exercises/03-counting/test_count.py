import unittest

from count import count_by_artist


class TestCountByArtist(unittest.TestCase):
    def test_counts_songs_per_artist(self):
        playlist = [
            {"title": "Blue", "artist": "Nina"},
            {"title": "Red", "artist": "Sam"},
            {"title": "Green", "artist": "Nina"},
        ]
        self.assertEqual(count_by_artist(playlist), {"Nina": 2, "Sam": 1})

    def test_an_empty_playlist_has_no_counts(self):
        self.assertEqual(count_by_artist([]), {})


if __name__ == "__main__":
    unittest.main()
