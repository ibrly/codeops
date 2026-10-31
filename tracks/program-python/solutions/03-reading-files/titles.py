def read_titles(path):
    with open(path, encoding="utf-8") as f:
        lines = f.readlines()
    return [line.strip() for line in lines if line.strip() != ""]
