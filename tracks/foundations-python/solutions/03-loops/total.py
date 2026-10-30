def total_duration(songs):
    total = 0
    for song in songs:
        total += song["seconds"]
    return total
