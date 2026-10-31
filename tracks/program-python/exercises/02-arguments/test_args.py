import unittest

from args import get_file


class TestGetFile(unittest.TestCase):
    def test_gives_back_the_file_typed_after_the_script(self):
        self.assertEqual(get_file(["/home/me/stats.py", "songs.txt"]), "songs.txt")

    def test_gives_back_none_when_no_file_was_typed(self):
        self.assertIsNone(get_file(["/home/me/stats.py"]))


if __name__ == "__main__":
    unittest.main()
