import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";

import { checkWebSchoolSupabaseAccess } from "./check-web-school-supabase.mjs";

test("allows a known legacy file at its baseline protected access count", async () => {
  const root = await mkdtemp(join(tmpdir(), "web-school-supabase-guard-"));

  try {
    const allowedDir = join(root, "apps", "web-school", "src", "services");
    await mkdir(allowedDir, { recursive: true });

    await writeFile(
      join(allowedDir, "auth.service.ts"),
      [
        "await supabase.from('student_accounts').select('id');",
        "await supabase.from('student_profiles').select('id');",
        "await supabase.from('school_settings').select('id');",
        "await supabase.from('school_users').select('id');",
        "await supabase.rpc('current_school_id');",
      ].join("\n"),
    );

    const result = await checkWebSchoolSupabaseAccess({ root, silent: true });

    assert.equal(result.ok, true);
    assert.deepEqual(result.violations, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("reports a known legacy file that exceeds its baseline protected access count", async () => {
  const root = await mkdtemp(join(tmpdir(), "web-school-supabase-guard-"));

  try {
    const allowedDir = join(root, "apps", "web-school", "src", "services");
    await mkdir(allowedDir, { recursive: true });

    await writeFile(
      join(allowedDir, "auth.service.ts"),
      [
        "await supabase.from('student_accounts').select('id');",
        "await supabase.from('student_profiles').select('id');",
        "await supabase.from('school_settings').select('id');",
        "await supabase.from('school_users').select('id');",
        "await supabase.rpc('current_school_id');",
        "await supabase.rpc('extra_direct_call');",
      ].join("\n"),
    );

    const result = await checkWebSchoolSupabaseAccess({ root, silent: true });

    assert.equal(result.ok, false);
    assert.deepEqual(
      result.violations.map((violation) => ({
        file: violation.file,
        token: violation.token,
      })),
      [
        {
          file: "apps/web-school/src/services/auth.service.ts",
          token: ".rpc(",
        },
      ],
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("reports new unallowlisted direct protected Supabase calls", async () => {
  const root = await mkdtemp(join(tmpdir(), "web-school-supabase-guard-"));

  try {
    const blockedDir = join(root, "apps", "web-school", "src", "new-feature");
    await mkdir(blockedDir, { recursive: true });

    await writeFile(
      join(blockedDir, "unsafe.ts"),
      "await supabase.rpc('new_direct_call');\nawait supabase.storage.from('files').list();\n",
    );

    const result = await checkWebSchoolSupabaseAccess({ root, silent: true });

    assert.equal(result.ok, false);
    assert.deepEqual(
      result.violations.map((violation) => ({
        file: violation.file,
        token: violation.token,
      })),
      [
        {
          file: "apps/web-school/src/new-feature/unsafe.ts",
          token: ".rpc(",
        },
        {
          file: "apps/web-school/src/new-feature/unsafe.ts",
          token: ".storage",
        },
      ],
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
