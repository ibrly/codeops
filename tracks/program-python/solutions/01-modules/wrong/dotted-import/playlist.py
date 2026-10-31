import helpers.format_time


def describe_song(song):
    return f"{song['title']} ({format_time(song['seconds'])})"
