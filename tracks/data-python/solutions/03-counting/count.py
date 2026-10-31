def count_by_artist(playlist):
    counts = {}
    for song in playlist:
        counts[song["artist"]] = counts.get(song["artist"], 0) + 1
    return counts
