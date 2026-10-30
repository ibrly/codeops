def rating_label(stars):
    if stars == 5:
        return "favorite"
    elif stars >= 3:
        return "good"
    else:
        return "skip"
