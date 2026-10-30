def average_duration(songs):
    if not songs:
        return 0
    total = 0
    for song in songs:
        total += song["seconds"]
    return total / len(songs)
