import contextlib
import io
import unittest

from report import report, song_line

INTRO = {"title": "Intro", "artist": "Nina", "seconds": 60}
OUTRO = {"title": "Outro", "artist": "Sam", "seconds": 240}


class TestReport(unittest.TestCase):
    def test_song_line_gives_back_the_line(self):
        self.assertEqual(song_line(INTRO), "Intro by Nina (1:00)")

    def test_report_joins_the_lines(self):
        self.assertEqual(report([INTRO, OUTRO]), "Intro by Nina (1:00)\nOutro by Sam (4:00)")

    def test_nothing_is_printed(self):
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            song_line(INTRO)
            report([INTRO, OUTRO])
        self.assertEqual(out.getvalue(), "")


if __name__ == "__main__":
    unittest.main()
