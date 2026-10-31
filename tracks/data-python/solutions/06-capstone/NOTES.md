**Task:** implement `merge_playlists` from scratch. Any hint makes it assisted.
**Lesson:** combines looping, building a new list, and a lookup keyed on two fields.
**Common mistakes:** keying on title only; `a.extend(b)` or `a.append(...)` on the input; trying to put dicts in a set (they aren't hashable, which is a good teaching moment for using a `(title, artist)` tuple).
**Accepted approaches:** a set of `(title, artist)` tuples; or `in` checks against the result list (fine at this size).
