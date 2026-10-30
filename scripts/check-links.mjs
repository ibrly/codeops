#!/usr/bin/env node
// Checks that relative links and #anchors in Markdown files point at things that exist.
// External (http/https/mailto) links are skipped so the check works offline.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const skipDirs = new Set([".git", "node_modules", ".codeops"]);

function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (skipDirs.has(entry.name)) return [];
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith(".md") ? [path] : [];
  });
}

// GitHub-style heading anchor: lowercase, drop punctuation, spaces to hyphens.
function slug(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/g, "-");
}

function anchors(file) {
  const text = readFileSync(file, "utf8").replace(/```[\s\S]*?```/g, "");
  return new Set(
    [...text.matchAll(/^#{1,6}\s+(.+)$/gm)].map((m) => slug(m[1].replace(/[*_`]/g, ""))),
  );
}

const errors = [];
const files = markdownFiles(root);

for (const file of files) {
  const text = readFileSync(file, "utf8").replace(/```[\s\S]*?```/g, "");
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    if (/^(https?:|mailto:)/.test(target)) continue;
    const [pathPart, anchor] = target.split("#");
    const dest = pathPart ? resolve(dirname(file), decodeURIComponent(pathPart)) : file;
    const where = relative(root, file);
    if (!existsSync(dest)) {
      errors.push(`${where}: missing target "${target}"`);
      continue;
    }
    if (anchor && dest.endsWith(".md") && statSync(dest).isFile() && !anchors(dest).has(anchor)) {
      errors.push(`${where}: missing anchor "#${anchor}" in ${relative(root, dest)}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} broken link(s) in ${files.length} Markdown file(s).`);
  process.exit(1);
}
console.log(`All relative links OK in ${files.length} Markdown file(s).`);
