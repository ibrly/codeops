import os
import subprocess
import sys
import tempfile
import unittest

SCRIPT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "stats.py")


def run_with(text):
    path = os.path.join(tempfile.mkdtemp(prefix="codeops-stats-"), "songs.txt")
    if text is not None:
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(text)
    return subprocess.run([sys.executable, SCRIPT, path], capture_output=True, text=True)


class TestStats(unittest.TestCase):
    def test_prints_the_count_total_and_longest_song(self):
        result = run_with("Intro,60\nMiddle,150\nOutro,240\n")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.strip(), "3 songs, 7:30 total, longest: Outro")

    def test_ignores_blank_lines(self):
        self.assertEqual(run_with("\nIntro,60\n\nOutro,5\n").stdout.strip(), "2 songs, 1:05 total, longest: Intro")

    def test_keeps_the_first_song_when_two_tie_for_longest(self):
        self.assertEqual(run_with("Blue,100\nRed,100\n").stdout.strip(), "2 songs, 3:20 total, longest: Blue")

    def test_a_missing_file_is_an_error_not_a_crash(self):
        result = run_with(None)
        self.assertEqual(result.returncode, 1)
        self.assertRegex(result.stderr, r"(?m)^Can't read .*songs\.txt")
        self.assertNotIn("Traceback", result.stderr)
        self.assertEqual(result.stdout, "")


if __name__ == "__main__":
    unittest.main()
