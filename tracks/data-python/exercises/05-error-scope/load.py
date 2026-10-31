from parse import parse_song


# Reads a playlist file's lines. Bad lines are skipped and counted, not fatal.
def load_songs(lines):
    songs = []
    skipped = 0
    try:
        for line in lines:
            songs.append(parse_song(line))
    except ValueError:
        skipped += 1
    return {"songs": songs, "skipped": skipped}
