**Planted bug:** `import helpers` makes `helpers` available, not `format_time`, so the bare call raises `NameError: name 'format_time' is not defined`.
**Lesson:** `import module` binds the module name; `from module import name` binds the name.
**Accepted fixes:** `from helpers import format_time`, or `helpers.format_time(...)`.
**Rejected (see `wrong/`):** `import helpers.format_time` treats the function as a submodule and fails with `ModuleNotFoundError`.
**Good hint (rung 3):** "Which names does `import helpers` give `playlist.py`? Try `print(dir())` after the import."
