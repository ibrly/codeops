import unittest

from has import has_artist

PLAYLIST = [
    {"title": "Blue", "artist": "Nina"},
    {"title": "Red", "artist": "Sam"},
    {"title": "Gold", "artist": "Ade"},
]


class TestHasArtist(unittest.TestCase):
    def test_finds_an_artist_on_the_first_song(self):
        self.assertIs(has_artist(PLAYLIST, "Nina"), True)

    def test_finds_an_artist_further_down_the_playlist(self):
        self.assertIs(has_artist(PLAYLIST, "Sam"), True)
        self.assertIs(has_artist(PLAYLIST, "Ade"), True)

    def test_says_no_for_an_artist_who_is_not_there(self):
        self.assertIs(has_artist(PLAYLIST, "Kai"), False)

    def test_says_no_for_an_empty_playlist(self):
        self.assertIs(has_artist([], "Nina"), False)


if __name__ == "__main__":
    unittest.main()
