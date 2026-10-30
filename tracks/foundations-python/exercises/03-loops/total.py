# Adds up how long a whole playlist is, in seconds.
def total_duration(songs):
    total = 0
    for i in range(len(songs) - 1):
        total += songs[i]["seconds"]
    return total
