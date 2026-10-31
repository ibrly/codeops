# "4:00": a length in seconds as minutes and seconds. This function is correct.
def format_time(seconds):
    return f"{seconds // 60}:{seconds % 60:02d}"


# "Intro by Nina (1:00)": one line of the report.
def song_line(song):
    return f"{song['title']} by {song['artist']} ({format_time(song['seconds'])})"


# Every song's line, one per line. This function is correct.
def report(songs):
    return "\n".join(song_line(song) for song in songs)
