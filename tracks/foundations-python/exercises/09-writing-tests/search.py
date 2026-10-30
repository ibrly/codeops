# Finds every song by an artist. Searching ignores upper/lower case.
def search_by_artist(playlist, artist):
    wanted = artist.lower()
    return [song for song in playlist if song["artist"].lower() == wanted]
