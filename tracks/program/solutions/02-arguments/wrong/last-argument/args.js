function getFile(argv) {
  return argv[argv.length - 1] ?? null;
}

module.exports = { getFile };
