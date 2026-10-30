# Edits one field of a song, chosen by name, e.g. update_field(song, "artist", "Nina").
def update_field(song, field, value):
    song["field"] = value
    return song
