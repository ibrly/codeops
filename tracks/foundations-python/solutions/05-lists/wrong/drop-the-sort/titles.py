def sorted_titles(playlist):
    titles = []
    for song in playlist:
        titles.append(song["title"])
    return titles
