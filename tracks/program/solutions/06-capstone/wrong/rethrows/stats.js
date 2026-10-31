const fs = require("node:fs");

const file = process.argv[2];
let text;
try {
  text = fs.readFileSync(file, "utf8");
} catch (e) {
  console.error(`Can't read ${file}`);
  throw e;
}

const songs = text
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line !== "")
  .map((line) => {
    const [title, seconds] = line.split(",");
    return { title, seconds: Number(seconds) };
  });

let total = 0;
let longest = songs[0];
for (const song of songs) {
  total += song.seconds;
  if (song.seconds > longest.seconds) longest = song;
}

const time = `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
console.log(`${songs.length} songs, ${time} total, longest: ${longest.title}`);
