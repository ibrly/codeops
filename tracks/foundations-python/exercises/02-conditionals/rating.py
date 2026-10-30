# Turns a 1-5 star rating into a label shown next to each song.
def rating_label(stars):
    if stars >= 3:
        return "good"
    elif stars == 5:
        return "favorite"
    else:
        return "skip"
