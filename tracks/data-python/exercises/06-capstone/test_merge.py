import unittest

from merge import merge_playlists

BLUE = {"title": "Blue", "artist": "Nina"}
RED = {"title": "Red", "artist": "Sam"}
GOLD = {"title": "Gold", "artist": "Ade"}


class TestMergePlaylists(unittest.TestCase):
    def test_keeps_songs_from_a_then_from_b_in_order(self):
        self.assertEqual(merge_playlists([BLUE, RED], [GOLD]), [BLUE, RED, GOLD])

    def test_a_song_in_both_playlists_appears_once(self):
        self.assertEqual(merge_playlists([BLUE, RED], [{"title": "Red", "artist": "Sam"}, GOLD]), [BLUE, RED, GOLD])

    def test_same_title_by_a_different_artist_is_a_different_song(self):
        cover = {"title": "Blue", "artist": "Sam"}
        self.assertEqual(merge_playlists([BLUE], [cover]), [BLUE, cover])

    def test_duplicates_inside_one_playlist_are_removed_too(self):
        self.assertEqual(merge_playlists([BLUE, dict(BLUE)], []), [BLUE])

    def test_the_inputs_are_left_unchanged(self):
        a, b = [BLUE], [RED]
        merge_playlists(a, b)
        self.assertEqual(a, [BLUE])
        self.assertEqual(b, [RED])

    def test_works_with_empty_playlists(self):
        self.assertEqual(merge_playlists([], []), [])
        self.assertEqual(merge_playlists([], [GOLD]), [GOLD])


if __name__ == "__main__":
    unittest.main()
