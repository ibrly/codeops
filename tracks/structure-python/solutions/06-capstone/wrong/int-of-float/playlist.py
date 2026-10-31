import json
import os
import sys


class Playlist:
    def __init__(self):
        self.songs = []

    def add(self, song):
        self.songs.append(song)

    def total_seconds(self):
        return sum(song["seconds"] for song in self.songs)

    def longest(self):
        longest = None
        for song in self.songs:
            if longest is None or song["seconds"] > longest["seconds"]:
                longest = song
        return longest

    def summary(self):
        total = self.total_seconds()
        text = f"{len(self.songs)} songs, {total // 60}:{total % 60:02d} total"
        longest = self.longest()
        if longest is not None:
            text += f", longest: {longest['title']}"
        return text


def load(path):
    playlist = Playlist()
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            for song in json.load(f):
                playlist.add(song)
    return playlist


def save(path, playlist):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(playlist.songs, f)


if __name__ == "__main__":
    path = sys.argv[1]
    playlist = load(path)
    if len(sys.argv) > 2 and sys.argv[2] == "add":
        title, artist, seconds = sys.argv[3:6]
        try:
            float(seconds)
        except ValueError:
            print("Seconds must be a whole number", file=sys.stderr)
            sys.exit(1)
        playlist.add({"title": title, "artist": artist, "seconds": int(float(seconds))})
        save(path, playlist)
        print(f"Added {title}")
    else:
        print(playlist.summary())
