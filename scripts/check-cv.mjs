// Build-time guard for the published CV.
//
// Extracts the text of public/benny-cv-2026-08.pdf and FAILS the build if it
// leaks anything it shouldn't (phone numbers, internal tool/infra names, MITRE
// technique IDs, stale "Present"/"Ramat" strings) or if the expected role start
// date "Jun 2025" is missing. If the PDF itself is absent the build is NOT
// failed — it exits 0 with a warning, so the app still builds without a CV.
//
// Dependency-free: prefers the `pdftotext` binary (poppler) when available for
// accurate extraction, and falls back to a zlib-based extractor otherwise, so
// it runs in CI without extra packages.

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import zlib from "node:zlib";

const PDF_PATH = "public/benny-cv-2026-08.pdf";

// Forbidden content — regexes and literal substrings.
const FORBIDDEN = [
  { label: "Israeli mobile number (05XXXXXXXX)", test: /05\d{8}/ },
  { label: "phone number (NNN-NNN-NNNN)", test: /\d{3}-\d{3}-\d{4}/ },
  { label: "CyberArk", test: "CyberArk" },
  { label: "T1003", test: "T1003" },
  { label: "T1558", test: "T1558" },
  { label: "T1562", test: "T1562" },
  { label: "Snowflake", test: "Snowflake" },
  { label: "OCSF", test: "OCSF" },
  { label: "PM2", test: "PM2" },
  { label: "IIS", test: "IIS" },
  { label: "Present", test: "Present" },
  { label: "Ramat", test: "Ramat" },
];

// Must be present — the corrected role start date.
const REQUIRED = "Jun 2025";

function extractWithPdftotext(path) {
  try {
    const r = spawnSync("pdftotext", ["-q", path, "-"], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
    if (r.status === 0 && r.stdout && r.stdout.trim().length > 0) return r.stdout;
  } catch {
    /* binary not available — fall through */
  }
  return null;
}

// Fallback: inflate FlateDecode streams and reconstruct visible text from PDF
// string literals. Good enough to catch the forbidden tokens above.
function extractWithZlib(buf) {
  const latin1 = buf.toString("latin1");
  let blob = latin1;

  const streamRe = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let m;
  while ((m = streamRe.exec(latin1)) !== null) {
    const raw = Buffer.from(m[1], "latin1");
    try {
      blob += "\n" + zlib.inflateSync(raw).toString("latin1");
    } catch {
      try {
        blob += "\n" + zlib.inflateRawSync(raw).toString("latin1");
      } catch {
        /* not a deflate stream */
      }
    }
  }

  // Concatenate PDF string literals — reconstructs show-text tokens even when
  // they are split across kerned TJ arrays.
  const literals = [];
  const litRe = /\((?:\\.|[^\\()])*\)/g;
  let s;
  while ((s = litRe.exec(blob)) !== null) {
    literals.push(s[0].slice(1, -1).replace(/\\([()\\])/g, "$1"));
  }

  return blob + "\n" + literals.join("");
}

function main() {
  if (!existsSync(PDF_PATH)) {
    console.warn(`[check-cv] WARNING: ${PDF_PATH} not found — skipping CV content check.`);
    process.exit(0);
  }

  const buf = readFileSync(PDF_PATH);
  const text = extractWithPdftotext(PDF_PATH) ?? extractWithZlib(buf);

  const failures = [];

  for (const { label, test } of FORBIDDEN) {
    if (test instanceof RegExp) {
      const hit = text.match(test);
      if (hit) failures.push(`contains forbidden ${label}: "${hit[0]}"`);
    } else if (text.includes(test)) {
      failures.push(`contains forbidden string: "${label}"`);
    }
  }

  if (!text.includes(REQUIRED)) {
    failures.push(`missing required string: "${REQUIRED}" (role start date)`);
  }

  if (failures.length > 0) {
    console.error(`\n[check-cv] FAIL — ${PDF_PATH} did not pass content checks:`);
    for (const f of failures) console.error(`  ✗ ${f}`);
    console.error("");
    process.exit(1);
  }

  console.log(`[check-cv] OK — ${PDF_PATH} passed content checks.`);
  process.exit(0);
}

main();
