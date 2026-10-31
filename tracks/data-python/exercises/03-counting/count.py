# How many songs each artist has in the playlist, e.g. {"Nina": 2, "Sam": 1}.
def count_by_artist(playlist):
    counts = {}
    for song in playlist:
        counts[song["artist"]] += 1
    return counts
