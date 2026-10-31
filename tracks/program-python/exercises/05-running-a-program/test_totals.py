import contextlib
import importlib
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))


def saved(playlist):
    path = os.path.join(tempfile.mkdtemp(prefix="codeops-totals-"), "playlist.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(playlist, f)
    return path


class TestTotals(unittest.TestCase):
    def test_importing_prints_nothing(self):
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            sys.modules.pop("totals", None)
            totals = importlib.import_module("totals")
        self.assertEqual(out.getvalue(), "")
        self.assertEqual(totals.total_seconds(saved([{"seconds": 60}, {"seconds": 30}])), 90)

    def test_running_it_prints_the_total(self):
        result = subprocess.run(
            [sys.executable, os.path.join(HERE, "totals.py"), saved([{"seconds": 60}, {"seconds": 30}])],
            capture_output=True, text=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.strip(), "90")


if __name__ == "__main__":
    unittest.main()
