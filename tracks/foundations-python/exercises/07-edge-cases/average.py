# The average length of a song in the playlist, in seconds.
def average_duration(songs):
    total = 0
    for song in songs:
        total += song["seconds"]
    return total / len(songs)
