from parse import parse_song


def load_songs(lines):
    songs = []
    skipped = 0
    for line in lines:
        try:
            songs.append(parse_song(line))
        except ValueError:
            skipped += 1
    return {"songs": songs, "skipped": skipped}
