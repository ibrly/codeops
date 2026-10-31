import os
import tempfile
import unittest

from store import load_playlist, save_playlist


def temp_file():
    return os.path.join(tempfile.mkdtemp(prefix="codeops-store-"), "playlist.json")


class TestStore(unittest.TestCase):
    def test_a_saved_playlist_loads_back_the_same(self):
        path = temp_file()
        playlist = [
            {"title": "Intro", "artist": "Nina", "seconds": 60},
            {"title": "Outro", "artist": "Sam", "seconds": 240},
        ]
        save_playlist(path, playlist)
        self.assertEqual(load_playlist(path), playlist)

    def test_an_empty_playlist_round_trips_too(self):
        path = temp_file()
        save_playlist(path, [])
        self.assertEqual(load_playlist(path), [])


if __name__ == "__main__":
    unittest.main()
