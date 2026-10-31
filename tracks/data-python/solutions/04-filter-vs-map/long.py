def long_songs(playlist, min_seconds):
    return [song["title"] for song in playlist if song["seconds"] > min_seconds]
