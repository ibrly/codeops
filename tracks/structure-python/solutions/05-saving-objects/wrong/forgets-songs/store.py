import json

from playlist import Playlist


# Saves a playlist's name and songs to a file. This function is correct.
def save_playlist(path, playlist):
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"name": playlist.name, "songs": playlist.songs}, f)


# Loads a playlist saved by save_playlist, as a Playlist again.
def load_playlist(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return Playlist(data["name"])
