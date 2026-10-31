import json
import sys


# The total length of the playlist saved in a JSON file, in seconds.
def total_seconds(path):
    with open(path, encoding="utf-8") as f:
        songs = json.load(f)
    return sum(song["seconds"] for song in songs)


print(total_seconds(sys.argv[1]))
