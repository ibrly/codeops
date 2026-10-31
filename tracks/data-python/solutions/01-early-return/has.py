def has_artist(playlist, artist):
    for song in playlist:
        if song["artist"] == artist:
            return True
    return False
