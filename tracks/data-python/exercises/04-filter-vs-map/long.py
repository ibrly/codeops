# Titles of the songs longer than min_seconds, for a "long tracks" list.
def long_songs(playlist, min_seconds):
    return [song["seconds"] > min_seconds for song in playlist]
