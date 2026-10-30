import unittest

from rating import rating_label


class TestRatingLabel(unittest.TestCase):
    def test_5_stars_is_a_favorite(self):
        self.assertEqual(rating_label(5), "favorite")

    def test_3_and_4_stars_are_good(self):
        self.assertEqual(rating_label(3), "good")
        self.assertEqual(rating_label(4), "good")

    def test_1_and_2_stars_are_skips(self):
        self.assertEqual(rating_label(1), "skip")
        self.assertEqual(rating_label(2), "skip")


if __name__ == "__main__":
    unittest.main()
