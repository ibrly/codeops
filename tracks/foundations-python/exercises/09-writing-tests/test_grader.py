# Grades the learner's test_mine.py: it must pass on the real search.py
# and fail on a case-sensitive copy. You don't need to edit this file.
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
LEARNER_TEST = os.path.join(HERE, "test_mine.py")

CASE_SENSITIVE = '''def search_by_artist(playlist, artist):
    return [song for song in playlist if song["artist"] == artist]
'''


def run_learner_test_with(search_source):
    with tempfile.TemporaryDirectory() as tmp:
        shutil.copy(LEARNER_TEST, os.path.join(tmp, "test_mine.py"))
        with open(os.path.join(tmp, "search.py"), "w") as f:
            f.write(search_source)
        env = dict(os.environ, PYTHONDONTWRITEBYTECODE="1")
        result = subprocess.run(
            [sys.executable, "-m", "unittest", "test_mine"],
            cwd=tmp, env=env, capture_output=True, text=True,
        )
        return result.returncode


class TestGrader(unittest.TestCase):
    def test_test_mine_exists(self):
        self.assertTrue(os.path.exists(LEARNER_TEST), "Create a file called test_mine.py in this folder.")

    def test_your_test_passes_on_the_working_search(self):
        with open(os.path.join(HERE, "search.py")) as f:
            source = f.read()
        self.assertEqual(run_learner_test_with(source), 0,
                         "Your test fails even on the working code. Check what it asserts.")

    def test_your_test_catches_the_case_sensitivity_bug(self):
        self.assertNotEqual(run_learner_test_with(CASE_SENSITIVE), 0,
                            "Your test still passes when search is case-sensitive, so it wouldn't catch that bug.")


if __name__ == "__main__":
    unittest.main()
