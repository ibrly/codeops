import unittest

from search import search_by_artist


class TestSearch(unittest.TestCase):
    def test_finds_songs_by_the_artist(self):
        playlist = [
            {"title": "Blue", "artist": "Nina"},
            {"title": "Red", "artist": "Sam"},
        ]
        self.assertEqual(search_by_artist(playlist, "Nina"), [{"title": "Blue", "artist": "Nina"}])


if __name__ == "__main__":
    unittest.main()
