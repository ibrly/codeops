import json


def save_playlist(path, playlist):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(playlist, f, indent=2)


def load_playlist(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)
