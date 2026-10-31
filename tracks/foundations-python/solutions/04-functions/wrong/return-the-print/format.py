def format_duration(seconds):
    minutes = seconds // 60
    rest = str(seconds % 60).zfill(2)
    return print(f"{minutes}:{rest}")
