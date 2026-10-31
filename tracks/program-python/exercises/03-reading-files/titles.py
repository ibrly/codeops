# Reads a file with one song title per line.
def read_titles(path):
    with open(path, encoding="utf-8") as f:
        lines = f.readlines()
    return [line for line in lines if line != "\n"]
