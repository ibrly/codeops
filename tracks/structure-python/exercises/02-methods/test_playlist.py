import unittest

from playlist import Playlist

INTRO = {"title": "Intro", "artist": "Nina", "seconds": 60}
MIDDLE = {"title": "Middle", "artist": "Sam", "seconds": 150}


class TestPlaylist(unittest.TestCase):
    def test_adds_songs_and_totals_them(self):
        p = Playlist("Morning Run")
        p.add(INTRO)
        p.add(MIDDLE)
        self.assertEqual(p.total_seconds(), 210)

    def test_summary_describes_the_playlist(self):
        p = Playlist("Morning Run")
        p.add(INTRO)
        p.add(MIDDLE)
        self.assertEqual(p.summary(), "Morning Run: 2 songs, 3:30")

    def test_summary_of_an_empty_playlist(self):
        self.assertEqual(Playlist("Morning Run").summary(), "Morning Run: 0 songs, 0:00")


if __name__ == "__main__":
    unittest.main()
