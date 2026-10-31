def merge_playlists(a, b):
    merged = []
    for song in a + b:
        if song not in merged:
            merged.append(song)
    return merged
