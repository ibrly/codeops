import sys

path = sys.argv[1]
try:
    with open(path, encoding="utf-8") as f:
        lines = f.read().splitlines()
except OSError:
    print(f"Can't read {path}", file=sys.stderr)
    sys.exit(1)

songs = []
for line in lines:
    if line.strip():
        title, seconds = line.split(",")
        songs.append({"title": title, "seconds": int(seconds)})

total = sum(song["seconds"] for song in songs)
longest = songs[0]
for song in songs:
    if song["seconds"] > longest["seconds"]:
        longest = song

print(f"{len(songs)} songs, {total // 60}:{total % 60:02d} total, longest: {longest['title']}")
