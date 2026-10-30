import unittest

from longest import longest_song

INTRO = {"title": "Intro", "seconds": 60}
EPIC = {"title": "Epic", "seconds": 420}
OUTRO = {"title": "Outro", "seconds": 30}


class TestLongestSong(unittest.TestCase):
    def test_finds_the_longest_song(self):
        self.assertIs(longest_song([INTRO, EPIC, OUTRO]), EPIC)

    def test_works_when_the_longest_song_is_last(self):
        self.assertIs(longest_song([INTRO, OUTRO, EPIC]), EPIC)

    def test_picks_the_first_song_when_two_tie(self):
        twin = {"title": "Twin", "seconds": 420}
        self.assertIs(longest_song([EPIC, twin]), EPIC)

    def test_works_with_a_single_song(self):
        self.assertIs(longest_song([OUTRO]), OUTRO)

    def test_an_empty_playlist_gives_none(self):
        self.assertIsNone(longest_song([]))

    def test_something_is_returned_for_a_non_empty_playlist(self):
        self.assertIsNotNone(longest_song([INTRO]))


if __name__ == "__main__":
    unittest.main()
