**Task:** implement `merge_playlists` from scratch. Any hint makes it assisted.
**Lesson:** combines looping, building a new list, and a lookup keyed on two fields.
**Common mistakes:** keying on title only; `a.extend(b)` or `a.append(...)` on the input; trying to put dicts in a set (they aren't hashable, which is a good teaching moment for using a `(title, artist)` tuple).
**Accepted approaches:** a set of `(title, artist)` tuples; or checking the result list for a song with the same title and artist.
**Rejected (see `wrong/`):** `if song not in merged` compares whole dictionaries, so the same song with a different length is kept twice.
