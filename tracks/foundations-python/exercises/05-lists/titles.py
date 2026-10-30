# Gives back the song titles in alphabetical order, for a tidy track list.
def sorted_titles(playlist):
    titles = []
    for song in playlist:
        titles.append(song["title"])
    return titles.sort()
