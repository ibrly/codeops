import json
import os
import subprocess
import sys
import tempfile
import unittest

from playlist import Playlist

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, "playlist.py")

INTRO = {"title": "Intro", "artist": "Nina", "seconds": 60}
MIDDLE = {"title": "Middle", "artist": "Sam", "seconds": 150}
OUTRO = {"title": "Outro", "artist": "Sam", "seconds": 240}


def temp_file():
    return os.path.join(tempfile.mkdtemp(prefix="codeops-playlist-"), "songs.json")


def run(*args):
    return subprocess.run([sys.executable, SCRIPT, *args], capture_output=True, text=True)


class TestPlaylistClass(unittest.TestCase):
    def test_totals_finds_the_longest_and_summarizes(self):
        p = Playlist()
        for song in (INTRO, MIDDLE, OUTRO):
            p.add(song)
        self.assertEqual(p.total_seconds(), 450)
        self.assertEqual(p.longest()["title"], "Outro")
        self.assertEqual(p.summary(), "3 songs, 7:30 total, longest: Outro")

    def test_keeps_the_first_song_when_two_tie_for_longest(self):
        p = Playlist()
        p.add({"title": "Blue", "artist": "Nina", "seconds": 100})
        p.add({"title": "Red", "artist": "Sam", "seconds": 100})
        self.assertEqual(p.longest()["title"], "Blue")

    def test_an_empty_playlist(self):
        p = Playlist()
        self.assertEqual(p.songs, [])
        self.assertIsNone(p.longest())
        self.assertEqual(p.summary(), "0 songs, 0:00 total")

    def test_two_playlists_dont_share_songs(self):
        a = Playlist()
        b = Playlist()
        a.add(INTRO)
        self.assertEqual(b.songs, [])


class TestPlaylistProgram(unittest.TestCase):
    def test_importing_runs_nothing(self):
        path = temp_file()
        env = dict(os.environ)
        env.pop("PYTHONSAFEPATH", None)
        result = subprocess.run(
            [sys.executable, "-c", "import playlist", path, "add", "X", "Y", "60"],
            cwd=HERE, env=env, capture_output=True, text=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout, "")
        self.assertFalse(os.path.exists(path))

    def test_adds_songs_saves_them_and_summarizes(self):
        path = temp_file()
        self.assertEqual(run(path).stdout.strip(), "0 songs, 0:00 total", "a file that doesn't exist yet is an empty playlist")
        added = run(path, "add", "Intro", "Nina", "60")
        self.assertEqual(added.returncode, 0, added.stderr)
        self.assertEqual(added.stdout.strip(), "Added Intro")
        self.assertEqual(run(path, "add", "Outro", "Sam", "240").returncode, 0)
        summary = run(path)
        self.assertEqual(summary.returncode, 0, summary.stderr)
        self.assertEqual(summary.stdout.strip(), "2 songs, 5:00 total, longest: Outro")
        with open(path, encoding="utf-8") as f:
            self.assertEqual(json.load(f), [
                {"title": "Intro", "artist": "Nina", "seconds": 60},
                {"title": "Outro", "artist": "Sam", "seconds": 240},
            ])

    def test_seconds_that_arent_a_whole_number_are_an_error_not_a_crash(self):
        for bad in ("abc", "60.5", "-5", "30abc"):
            with self.subTest(seconds=bad):
                path = temp_file()
                result = run(path, "add", "Intro", "Nina", bad)
                self.assertEqual(result.returncode, 1, f'seconds "{bad}" should be refused')
                self.assertRegex(result.stderr, r"(?m)^Seconds must be a whole number")
                self.assertNotIn("Traceback", result.stderr)
                self.assertEqual(result.stdout, "")
                self.assertFalse(os.path.exists(path))


if __name__ == "__main__":
    unittest.main()
