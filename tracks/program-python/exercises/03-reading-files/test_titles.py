import os
import tempfile
import unittest

from titles import read_titles


def file_with(text):
    folder = tempfile.mkdtemp(prefix="codeops-titles-")
    path = os.path.join(folder, "titles.txt")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    return path


class TestReadTitles(unittest.TestCase):
    def test_reads_one_title_per_line(self):
        self.assertEqual(read_titles(file_with("Intro\nLong Road\nOutro\n")), ["Intro", "Long Road", "Outro"])

    def test_skips_blank_lines(self):
        self.assertEqual(read_titles(file_with("Intro\n\nOutro\n\n")), ["Intro", "Outro"])


if __name__ == "__main__":
    unittest.main()
