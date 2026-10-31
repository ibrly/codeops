# Gives back a new playlist with one more song, without changing the original.
def add_song(playlist, song):
    copy = playlist
    copy.append(song)
    return copy
