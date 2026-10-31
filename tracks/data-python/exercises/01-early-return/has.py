# Is there at least one song by this artist in the playlist?
def has_artist(playlist, artist):
    for song in playlist:
        if song["artist"] == artist:
            return True
        else:
            return False
    return False
