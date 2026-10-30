import unittest

from update import update_field


class TestUpdateField(unittest.TestCase):
    def test_updates_the_title(self):
        song = {"title": "Old Name", "artist": "Nina", "seconds": 200}
        self.assertEqual(update_field(song, "title", "New Name")["title"], "New Name")

    def test_updates_the_artist(self):
        song = {"title": "Song", "artist": "Nina", "seconds": 200}
        self.assertEqual(update_field(song, "artist", "Sam")["artist"], "Sam")

    def test_does_not_add_a_stray_key(self):
        song = {"title": "Song", "artist": "Nina", "seconds": 200}
        self.assertEqual(list(update_field(song, "seconds", 180)), ["title", "artist", "seconds"])


if __name__ == "__main__":
    unittest.main()
