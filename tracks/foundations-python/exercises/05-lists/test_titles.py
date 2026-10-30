import unittest

from titles import sorted_titles


class TestSortedTitles(unittest.TestCase):
    def test_lists_titles_alphabetically(self):
        playlist = [
            {"title": "Outro", "seconds": 30},
            {"title": "Intro", "seconds": 60},
            {"title": "Long Road", "seconds": 240},
        ]
        self.assertEqual(sorted_titles(playlist), ["Intro", "Long Road", "Outro"])

    def test_an_empty_playlist_has_no_titles(self):
        self.assertEqual(sorted_titles([]), [])


if __name__ == "__main__":
    unittest.main()
