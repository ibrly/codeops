from parse import parse_song


def load_songs(lines):
    good = [line for line in lines if "," in line]
    songs = []
    try:
        songs = [parse_song(line) for line in good]
    except ValueError:
        pass
    return {"songs": songs, "skipped": len(lines) - len(good)}
