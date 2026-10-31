# Small helpers shared by the rest of the playlist program. This file is correct.
def format_time(seconds):
    return f"{seconds // 60}:{seconds % 60:02d}"


def shout(text):
    return text.upper()
