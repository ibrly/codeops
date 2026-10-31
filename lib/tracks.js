// Shared helpers for CodeOps tracks and learner progress. Used by bin/ and scripts/.
const fs = require("node:fs");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");

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
// A file that exists but doesn't parse stops the script, so it's never overwritten with empty progress.
function readProgress(cwd) {
  const file = progressFile(cwd);
  let data = {};
  if (fs.existsSync(file)) {
    try {
      data = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
      console.error(
        `.codeops/progress.json isn't valid JSON (${err.message}), so CodeOps won't touch it.\n` +
          "Fix the file, or move it aside to start progress fresh. Nothing was changed.",
      );
      process.exit(1);
    }
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
// Resolves to { status, output, timedOut?, missing? }. A run that exceeds the timeout (an infinite
// loop is a normal beginner mistake) is killed along with every process it started.
const testTimeoutMs = Number(process.env.CODEOPS_TEST_TIMEOUT_MS) || 10000;

// Candidates for the test command's program. Windows may have python, py, or a Store stub for python3.
function candidates(cmd) {
  if (cmd === "node") return [[process.execPath]];
  if (cmd === "python3" && process.platform === "win32") return [["python3"], ["python"], ["py", "-3"]];
  return [[cmd]];
}

function spawnWithTimeout(argv, dir, env) {
  return new Promise((resolve) => {
    const posix = process.platform !== "win32";
    const child = spawn(argv[0], argv.slice(1), { cwd: dir, env, detached: posix, windowsHide: true });
    let output = "";
    let timedOut = false;
    child.stdout.on("data", (d) => (output += d));
    child.stderr.on("data", (d) => (output += d));
    const timer = setTimeout(() => {
      timedOut = true;
      try {
        if (posix) process.kill(-child.pid, "SIGKILL");
        else spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { windowsHide: true });
      } catch {}
    }, testTimeoutMs);
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ error });
    });
    child.on("close", (status) => {
      clearTimeout(timer);
      resolve({ status: timedOut ? 1 : status, output: output.trim(), timedOut });
    });
  });
}

async function runTests(track, dir) {
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  env.PYTHONDONTWRITEBYTECODE = "1";
  const [cmd, ...args] = track.test;
  for (const prefix of candidates(cmd)) {
    const run = await spawnWithTimeout([...prefix, ...args], dir, env);
    if (run.error?.code === "ENOENT") continue;
    // 9009 is Windows' "command not found", which the Microsoft Store python3 stub also returns.
    if (process.platform === "win32" && run.status === 9009) continue;
    if (run.error) return { status: 2, output: String(run.error.message), missing: true };
    if (run.timedOut) {
      run.output += `\n\nThe tests were stopped after ${testTimeoutMs / 1000} seconds. The code may be looping forever.`;
    }
    return run;
  }
  return { status: 2, output: `${cmd} isn't installed or isn't on your PATH. This track needs ${track.language}.`, missing: true };
}

const isTestFile = (name) => /\.test\.js$|^test_.*\.py$/.test(name);

// Copies the learner's exercise folder to a temp dir and restores the shipped test files there,
// so a learner can't pass by editing a test. Test files the learner wrote (not shipped) are kept.
// Returns { dir, changed, cleanup }, where changed lists shipped tests the learner's copy differs from.
function prepareCheck(track, id, learnerDir) {
  const os = require("node:os");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codeops-check-"));
  fs.cpSync(learnerDir, dir, { recursive: true, filter: (src) => !src.includes("__pycache__") });
  const shipped = path.join(track.exercises, id);
  const changed = [];
  for (const name of fs.readdirSync(shipped).filter(isTestFile)) {
    const original = fs.readFileSync(path.join(shipped, name));
    const mine = path.join(learnerDir, name);
    if (!fs.existsSync(mine) || !original.equals(fs.readFileSync(mine))) changed.push(name);
    fs.writeFileSync(path.join(dir, name), original);
  }
  return { dir, changed, cleanup: () => fs.rmSync(dir, { recursive: true, force: true }) };
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
  prepareCheck,
  localDate,
};
