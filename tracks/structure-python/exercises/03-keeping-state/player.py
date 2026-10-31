# Plays a list of songs in order, one at a time.
class Player:
    # This method is correct.
    def __init__(self, songs):
        self.songs = songs
        self.position = 0

    # The song the player is on. This method is correct.
    def current(self):
        return self.songs[self.position]

    # Moves on to the next song (back to the first after the last) and gives it back.
    def next(self):
        position = (self.position + 1) % len(self.songs)
        return self.songs[position]
