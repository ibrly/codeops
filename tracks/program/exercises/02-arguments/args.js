// Which file did the user ask for? For `node stats.js songs.txt`, call getFile(process.argv).
function getFile(argv) {
  return argv[1];
}

module.exports = { getFile };
