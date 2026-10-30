# Turns a number of seconds into minutes:seconds, like 185 -> "3:05".
def format_duration(seconds):
    minutes = seconds // 60
    rest = str(seconds % 60).zfill(2)
    print(f"{minutes}:{rest}")
