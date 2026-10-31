def count_by_artist(playlist):
    counts = {}
    for song in playlist:
        if song["artist"] not in counts:
            counts[song["artist"]] = 1
        counts[song["artist"]] += 1
    return counts
