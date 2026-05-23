#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const WEB_SCHOOL_SRC = "apps/web-school/src";
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);

const LEGACY_PROTECTED_ACCESS_BASELINES = new Map([
  ["apps/web-school/src/admin/services/admin.service.ts", 12],
  ["apps/web-school/src/admin/services/student-admin.service.ts", 9],
  ["apps/web-school/src/app/(student)/add-drop/page.tsx", 3],
  ["apps/web-school/src/app/(student)/advised/page.tsx", 3],
  ["apps/web-school/src/app/(student)/enrollment/enroll/page.tsx", 3],
  ["apps/web-school/src/app/admin/services/admin-auth.service.ts", 13],
  ["apps/web-school/src/app/admin/services/admin.service.ts", 23],
  ["apps/web-school/src/app/admin/services/student-admin.service.ts", 9],
  ["apps/web-school/src/app/admissions/components/ActivityLog.tsx", 1],
  ["apps/web-school/src/app/admissions/services/admissions.service.ts", 17],
  ["apps/web-school/src/app/admissions/services/tracking.service.ts", 3],
  ["apps/web-school/src/app/alumni/services/alumni.service.ts", 2],
  ["apps/web-school/src/app/professor/components/NotificationBell.tsx", 2],
  ["apps/web-school/src/app/professor/services/professor.service.ts", 16],
  ["apps/web-school/src/applicant/components/ActivityLog.tsx", 1],
  ["apps/web-school/src/applicant/services/admissions.service.ts", 17],
  ["apps/web-school/src/applicant/services/tracking.service.ts", 3],
  ["apps/web-school/src/components/NotificationBell.tsx", 2],
  ["apps/web-school/src/components/TopNav.tsx", 2],
  ["apps/web-school/src/contexts/AuthContext.tsx", 4],
  ["apps/web-school/src/professor/services/professor.service.ts", 14],
  ["apps/web-school/src/services/auth.service.ts", 5],
  ["apps/web-school/src/shared/auth.service.ts", 5],
  ["apps/web-school/src/shared/components/TopNav.tsx", 2],
  ["apps/web-school/src/student/add-drop/page.tsx", 2],
  ["apps/web-school/src/student/advised/page.tsx", 2],
  ["apps/web-school/src/student/enrollment/enroll/page.tsx", 3],
]);

const PROTECTED_ACCESS_PATTERNS = [
  { token: ".from(", pattern: /(?<!Array)(?<!storage)\.from\s*\(/g },
  { token: ".rpc(", pattern: /\.rpc\s*\(/g },
  { token: ".storage", pattern: /\.storage\b/g },
];

async function listSourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listSourceFiles(path));
      continue;
    }

    if (entry.isFile() && SOURCE_EXTENSIONS.has(path.slice(path.lastIndexOf(".")))) {
      files.push(path);
    }
  }

  return files;
}

function toPosixRelative(root, file) {
  return relative(root, file).split(sep).join("/");
}

function findProtectedAccess(content) {
  const matches = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const { token, pattern } of PROTECTED_ACCESS_PATTERNS) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        matches.push({
          line: index + 1,
          token,
          text: line.trim(),
        });
      }
    }
  });

  return matches;
}

export async function checkWebSchoolSupabaseAccess({ root = process.cwd(), silent = false } = {}) {
  const resolvedRoot = resolve(root);
  const srcRoot = resolve(resolvedRoot, WEB_SCHOOL_SRC);
  const files = await listSourceFiles(srcRoot);
  const violations = [];

  for (const filePath of files) {
    const file = toPosixRelative(resolvedRoot, filePath);
    const matches = findProtectedAccess(await readFile(filePath, "utf8"));
    const baselineCount = LEGACY_PROTECTED_ACCESS_BASELINES.get(file);

    if (matches.length > 0 && baselineCount === undefined) {
      for (const match of matches) {
        violations.push({ file, ...match });
      }
    } else if (baselineCount !== undefined && matches.length > baselineCount) {
      for (const match of matches.slice(baselineCount)) {
        violations.push({ file, ...match });
      }
    }
  }

  if (!silent) {
    if (violations.length === 0) {
      console.log("web-school Supabase protected access guard passed.");
    } else {
      console.error("New direct protected Supabase access found in web-school:");
      for (const violation of violations) {
        console.error(
          `- ${violation.file}:${violation.line} ${violation.token} ${violation.text}`,
        );
      }
      console.error(
        "Move this access behind a backend API or add a documented temporary exception before changing the baseline.",
      );
    }
  }

  return {
    ok: violations.length === 0,
    violations,
  };
}

async function main() {
  const result = await checkWebSchoolSupabaseAccess();
  process.exitCode = result.ok ? 0 : 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
