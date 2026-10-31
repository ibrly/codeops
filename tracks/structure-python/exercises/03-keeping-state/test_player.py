import unittest

from player import Player

INTRO = {"title": "Intro", "artist": "Nina", "seconds": 60}
MIDDLE = {"title": "Middle", "artist": "Sam", "seconds": 150}
OUTRO = {"title": "Outro", "artist": "Sam", "seconds": 240}


class TestPlayer(unittest.TestCase):
    def test_starts_on_the_first_song(self):
        self.assertEqual(Player([INTRO, MIDDLE, OUTRO]).current(), INTRO)

    def test_next_moves_through_the_songs(self):
        player = Player([INTRO, MIDDLE, OUTRO])
        self.assertEqual(player.next(), MIDDLE)
        self.assertEqual(player.next(), OUTRO)

    def test_current_is_the_song_next_moved_to(self):
        player = Player([INTRO, MIDDLE, OUTRO])
        player.next()
        self.assertEqual(player.current(), MIDDLE)

    def test_works_with_any_number_of_songs_and_leaves_the_list_alone(self):
        songs = [INTRO, MIDDLE]
        player = Player(songs)
        player.next()
        self.assertEqual(songs, [INTRO, MIDDLE])
        self.assertEqual(player.next(), INTRO)

    def test_goes_back_to_the_first_song_after_the_last(self):
        player = Player([INTRO, MIDDLE, OUTRO])
        player.next()
        player.next()
        self.assertEqual(player.next(), INTRO)


if __name__ == "__main__":
    unittest.main()
