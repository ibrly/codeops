import unittest

from format import format_duration


class TestFormatDuration(unittest.TestCase):
    def test_formats_minutes_and_seconds(self):
        self.assertEqual(format_duration(185), "3:05")

    def test_pads_single_digit_seconds(self):
        self.assertEqual(format_duration(61), "1:01")

    def test_can_be_used_to_build_a_label(self):
        self.assertEqual("Length: " + format_duration(240), "Length: 4:00")


if __name__ == "__main__":
    unittest.main()
