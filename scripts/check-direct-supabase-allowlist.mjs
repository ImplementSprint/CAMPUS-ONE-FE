import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const roots = ['apps/web-lms', 'apps/web-school/src'];
const allowlistPath = path.join('docs', 'direct-supabase-allowlist.txt');
const bannedPattern = /\b(createBrowserClient|createClient|supabase\.(from|schema|auth|storage|rpc))\b/;
const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const ignoredParts = new Set(['node_modules', '.next', 'dist', 'build', 'coverage']);

function normalize(filePath) {
  return filePath.split(path.sep).join('/');
}

function readAllowlist() {
  if (!existsSync(allowlistPath)) return new Set();
  const entries = readFileSync(allowlistPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
  return new Set(entries);
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (ignoredParts.has(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, files);
    } else if (allowedExtensions.has(path.extname(entry))) {
      files.push(fullPath);
    }
  }
  return files;
}

const allowlist = readAllowlist();
const violations = [];

for (const root of roots) {
  if (!existsSync(root)) continue;
  for (const file of walk(root)) {
    const normalized = normalize(file);
    const contents = readFileSync(file, 'utf8');
    if (bannedPattern.test(contents) && !allowlist.has(normalized)) {
      violations.push(normalized);
    }
  }
}

if (violations.length > 0) {
  console.error('Direct Supabase usage found outside docs/direct-supabase-allowlist.txt:');
  for (const file of violations) console.error(`- ${file}`);
  process.exit(1);
}

console.log(`Direct Supabase allowlist check passed (${allowlist.size} allowed files).`);
