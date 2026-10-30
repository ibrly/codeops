import unittest

from duration import parse_seconds


class TestParseSeconds(unittest.TestCase):
    def test_turns_text_into_a_number(self):
        self.assertEqual(parse_seconds("185"), 185)

    def test_the_result_can_be_used_in_math(self):
        self.assertEqual(parse_seconds("185") + parse_seconds("60"), 245)


if __name__ == "__main__":
    unittest.main()
