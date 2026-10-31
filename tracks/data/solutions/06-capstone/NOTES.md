**Task:** implement `mergePlaylists` from scratch. Any hint makes it assisted.
**Lesson:** combines looping, building a new array, and a lookup (object or Set) keyed on two fields.
**Common mistakes:** comparing song objects with `===` (two equal-looking objects are different objects); keying on title only; `a.push(...)` on the input; joining title and artist with a separator that can appear in the data.
**Accepted approaches:** a Set or object of `title + separator + artist` keys; or `findIndex`/`some` checks against the result (fine at this size).
