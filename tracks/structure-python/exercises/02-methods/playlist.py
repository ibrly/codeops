# A playlist that can add songs and describe itself.
class Playlist:
    # This method is correct.
    def __init__(self, name):
        self.name = name
        self.songs = []

    # This method is correct.
    def add(self, song):
        self.songs.append(song)

    # The playlist's total length, in seconds. This method is correct.
    def total_seconds(self):
        return sum(song["seconds"] for song in self.songs)

    # "Morning Run: 2 songs, 3:30": the name, how many songs, and their total length.
    def summary(self):
        total = total_seconds()
        return f"{self.name}: {len(self.songs)} songs, {total // 60}:{total % 60:02d}"
