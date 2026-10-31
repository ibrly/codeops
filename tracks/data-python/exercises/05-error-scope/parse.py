# Turns "Title,seconds" into a song. Raises ValueError if the line isn't in that format.
# This file is correct; you don't need to change it.
def parse_song(line):
    parts = line.split(",")
    if len(parts) != 2 or not parts[0]:
        raise ValueError(f'Can\'t read song: "{line}"')
    return {"title": parts[0], "seconds": int(parts[1])}
