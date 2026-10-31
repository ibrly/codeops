import json
import sys


def total_seconds(path):
    with open(path, encoding="utf-8") as f:
        songs = json.load(f)
    return sum(song["seconds"] for song in songs)


if __name__ == "__main__":
    print(total_seconds(sys.argv[1]))
