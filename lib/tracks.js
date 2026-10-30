// Shared helpers for CodeOps tracks and learner progress. Used by bin/ and scripts/.
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const tracksDir = path.join(__dirname, "..", "tracks");
const defaultTrack = "foundations";

function listTracks() {
  return fs
    .readdirSync(tracksDir)
    .filter((name) => fs.existsSync(path.join(tracksDir, name, "track.json")))
    .sort();
}

function loadTrack(name) {
  const dir = path.join(tracksDir, name);
  const manifest = path.join(dir, "track.json");
  if (!fs.existsSync(manifest)) return null;
  const { title, language, test, capstone } = JSON.parse(fs.readFileSync(manifest, "utf8"));
  const exercises = path.join(dir, "exercises");
  const ids = fs.readdirSync(exercises).filter((d) => /^\d\d-/.test(d)).sort();
  return { name, dir, exercises, title, language, test, capstone, ids };
}

function progressFile(cwd) {
  return path.join(cwd, ".codeops", "progress.json");
}

// Reads .codeops/progress.json, migrating the v0.1 shape ({exercises}) to v2 ({track, tracks}).
function readProgress(cwd) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(progressFile(cwd), "utf8"));
  } catch {
    data = {};
  }
  if (data.exercises && !data.tracks) {
    data = { track: defaultTrack, tracks: { [defaultTrack]: { exercises: data.exercises } } };
  }
  data.track ??= defaultTrack;
  data.tracks ??= {};
  return data;
}

function ensureDataDir(cwd) {
  const dir = path.join(cwd, ".codeops");
  fs.mkdirSync(dir, { recursive: true });
  const ignore = path.join(dir, ".gitignore");
  if (!fs.existsSync(ignore)) fs.writeFileSync(ignore, "*\n");
  return dir;
}

function writeProgress(cwd, progress) {
  ensureDataDir(cwd);
  fs.writeFileSync(progressFile(cwd), JSON.stringify(progress, null, 2) + "\n");
}

function trackExercises(progress, track) {
  progress.tracks[track] ??= { exercises: {} };
  return progress.tracks[track].exercises;
}

function activeTrack(progress) {
  return progress.track || defaultTrack;
}

function workspace(cwd, track) {
  return path.join(cwd, `codeops-${track}`);
}

// Runs a track's test command in dir. The command is an argv array, never a shell string.
function runTests(track, dir) {
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  env.PYTHONDONTWRITEBYTECODE = "1";
  let [cmd, ...args] = track.test;
  if (cmd === "node") cmd = process.execPath;
  let run = spawnSync(cmd, args, { cwd: dir, encoding: "utf8", env });
  if (run.error?.code === "ENOENT" && cmd === "python3" && process.platform === "win32") {
    run = spawnSync("python", args, { cwd: dir, encoding: "utf8", env });
  }
  if (run.error?.code === "ENOENT") {
    return { status: 2, output: `${track.test[0]} isn't on your PATH. This track needs ${track.language}.`, missing: true };
  }
  return { status: run.status, output: ((run.stdout || "") + (run.stderr || "")).trim() };
}

function localDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

module.exports = {
  defaultTrack,
  listTracks,
  loadTrack,
  readProgress,
  writeProgress,
  ensureDataDir,
  trackExercises,
  activeTrack,
  workspace,
  runTests,
  localDate,
};
