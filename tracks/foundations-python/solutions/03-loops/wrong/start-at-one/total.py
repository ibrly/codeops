def total_duration(songs):
    total = 0
    for i in range(1, len(songs)):
        total += songs[i]["seconds"]
    return total
