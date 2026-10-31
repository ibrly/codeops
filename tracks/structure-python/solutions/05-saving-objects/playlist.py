# A playlist that can add songs and total them. This file is correct.
class Playlist:
    def __init__(self, name):
        self.name = name
        self.songs = []

    def add(self, song):
        self.songs.append(song)

    def total_seconds(self):
        return sum(song["seconds"] for song in self.songs)
