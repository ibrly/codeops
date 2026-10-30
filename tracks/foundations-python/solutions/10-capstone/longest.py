def longest_song(playlist):
    if not playlist:
        return None
    longest = playlist[0]
    for song in playlist:
        if song["seconds"] > longest["seconds"]:
            longest = song
    return longest
