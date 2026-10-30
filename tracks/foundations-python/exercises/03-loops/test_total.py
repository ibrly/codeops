import unittest

from total import total_duration

PLAYLIST = [
    {"title": "Intro", "seconds": 60},
    {"title": "Long Road", "seconds": 240},
    {"title": "Outro", "seconds": 30},
]


class TestTotalDuration(unittest.TestCase):
    def test_adds_up_every_song(self):
        self.assertEqual(total_duration(PLAYLIST), 330)

    def test_works_for_a_single_song(self):
        self.assertEqual(total_duration([{"title": "Solo", "seconds": 200}]), 200)


if __name__ == "__main__":
    unittest.main()
