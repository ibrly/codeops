import unittest

from long import long_songs

PLAYLIST = [
    {"title": "Intro", "seconds": 60},
    {"title": "Epic", "seconds": 420},
    {"title": "Exactly", "seconds": 300},
]


class TestLongSongs(unittest.TestCase):
    def test_gives_back_only_the_titles_of_long_songs(self):
        self.assertEqual(long_songs(PLAYLIST, 300), ["Epic"])

    def test_a_song_exactly_at_the_limit_is_not_long(self):
        self.assertEqual(long_songs([{"title": "Exactly", "seconds": 300}], 300), [])

    def test_an_empty_playlist_has_no_long_songs(self):
        self.assertEqual(long_songs([], 300), [])


if __name__ == "__main__":
    unittest.main()
