def merge_playlists(a, b):
    seen = set()
    merged = []
    for song in a + b:
        key = (song["title"], song["artist"])
        if key not in seen:
            seen.add(key)
            merged.append(song)
    return merged
