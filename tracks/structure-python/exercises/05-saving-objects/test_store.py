import os
import tempfile
import unittest

from playlist import Playlist
from store import load_playlist, save_playlist

INTRO = {"title": "Intro", "artist": "Nina", "seconds": 60}
MIDDLE = {"title": "Middle", "artist": "Sam", "seconds": 150}
OUTRO = {"title": "Outro", "artist": "Sam", "seconds": 240}


def saved_and_loaded():
    path = os.path.join(tempfile.mkdtemp(prefix="codeops-store-"), "playlist.json")
    playlist = Playlist("Morning Run")
    playlist.add(INTRO)
    playlist.add(MIDDLE)
    save_playlist(path, playlist)
    return load_playlist(path)


class TestStore(unittest.TestCase):
    def test_loads_back_the_name_and_songs(self):
        loaded = saved_and_loaded()
        self.assertEqual(loaded.name, "Morning Run")
        self.assertEqual(loaded.songs, [INTRO, MIDDLE])

    def test_the_loaded_playlist_can_total_its_songs(self):
        self.assertEqual(saved_and_loaded().total_seconds(), 210)

    def test_the_loaded_playlist_is_a_real_playlist(self):
        loaded = saved_and_loaded()
        self.assertIsInstance(loaded, Playlist)
        loaded.add(OUTRO)
        self.assertEqual(loaded.total_seconds(), 450)


if __name__ == "__main__":
    unittest.main()
