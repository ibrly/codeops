import unittest

from add import add_song


class TestAddSong(unittest.TestCase):
    def test_the_new_playlist_has_the_song_at_the_end(self):
        original = [{"title": "Intro"}]
        self.assertEqual(add_song(original, {"title": "Outro"}), [{"title": "Intro"}, {"title": "Outro"}])

    def test_the_original_playlist_is_unchanged(self):
        original = [{"title": "Intro"}]
        add_song(original, {"title": "Outro"})
        self.assertEqual(original, [{"title": "Intro"}])

    def test_the_result_is_a_different_list_from_the_original(self):
        original = []
        self.assertIsNot(add_song(original, {"title": "Solo"}), original)


if __name__ == "__main__":
    unittest.main()
