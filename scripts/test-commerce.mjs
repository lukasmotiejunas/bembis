import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
const root = process.cwd();
const out = fs.mkdtempSync(path.join(os.tmpdir(), "bembis-commerce-"));
try {
  fs.symlinkSync(
    path.join(root, "node_modules"),
    path.join(out, "node_modules"),
    "dir",
  );
  const compile = spawnSync(
    process.execPath,
    [
      "node_modules/typescript/bin/tsc",
      "--strict",
      "--module",
      "commonjs",
      "--moduleResolution",
      "node",
      "--esModuleInterop",
      "--skipLibCheck",
      "--target",
      "es2020",
      "--noEmitOnError",
      "--outDir",
      out,
      "tests/commerce.test.ts",
    ],
    { cwd: root, stdio: "inherit" },
  );
  if (compile.status !== 0) process.exitCode = compile.status ?? 1;
  else
    process.exitCode =
      spawnSync(
        process.execPath,
        ["--test", path.join(out, "tests/commerce.test.js"), path.join(root, "tests/google-sheets.test.mjs")],
        { stdio: "inherit" },
      ).status ?? 1;
} finally {
  fs.rmSync(out, { recursive: true, force: true });
}
