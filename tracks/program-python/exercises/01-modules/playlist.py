import helpers


# "Outro (4:00)": a song's title with its length.
def describe_song(song):
    return f"{song['title']} ({format_time(song['seconds'])})"
