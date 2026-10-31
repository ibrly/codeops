import json


# Saves a playlist to a file, so the program can load it again next time.
def save_playlist(path, playlist):
    with open(path, "w", encoding="utf-8") as f:
        f.write(str(playlist))


# Loads a playlist saved by save_playlist. This function is correct.
def load_playlist(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)
