import unittest

from playlist import Playlist

INTRO = {"title": "Intro", "artist": "Nina", "seconds": 60}


class TestPlaylist(unittest.TestCase):
    def test_a_playlist_keeps_its_name(self):
        self.assertEqual(Playlist("Morning Run").name, "Morning Run")
        self.assertEqual(Playlist("Evening Walk").name, "Evening Walk")

    def test_a_new_playlist_has_no_songs(self):
        self.assertEqual(Playlist("Morning Run").songs, [])

    def test_each_playlist_has_its_own_songs(self):
        a = Playlist("Morning Run")
        b = Playlist("Evening Walk")
        a.songs.append(INTRO)
        self.assertEqual(b.songs, [])


if __name__ == "__main__":
    unittest.main()
