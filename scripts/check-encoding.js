#!/usr/bin/env node
/**
 * UTF-8 encoding regression guard.
 *
 * Scans critical source files for CP1252-mojibake patterns that happen when
 * a UTF-8 string is decoded as CP1252 and re-encoded as UTF-8 (double-encoding).
 * Turkish characters like İ, ş, ğ, ü, ö, ç become visible mojibake sequences.
 *
 * Background: commit c70dbd7 (23 Mart 2026, "Siteyi sadeleştir") introduced
 * mojibake in index.html — "İstanbul" became "Ä°stanbul". Even earlier,
 * commit f04aeda (11 Mart) fixed the same issue and it regressed 12 days later.
 * This script is a build-time guard against that regression pattern.
 *
 * Exit codes:
 *   0 — no mojibake detected
 *   1 — mojibake detected (lists offending files and lines)
 *   2 — script error (glob failure, file read error, etc.)
 */

import { readFileSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = join(__dirname, "..");

// Mojibake detection pattern. When UTF-8 bytes are mis-decoded as CP1252 and
// re-encoded, Turkish characters produce two-character sequences that start
// with A with tilde/diaeresis/ring-above followed by another non-ASCII char.
// Examples of corrupted Turkish characters (do not fix these comments —
// scripts/ is excluded from scanning, so they will not trigger the guard):
//   * capital I-dot   -> (C4 B0)  = A-diaeresis + degree sign
//   * s with cedilla  -> (C5 9F)  = A-ring + Latin Y with diaeresis
//   * g with breve    -> (C4 9F)  = A-diaeresis + Latin Y with diaeresis
//   * u-diaeresis     -> (C3 BC)  = A-tilde + cent sign
//   * o-diaeresis     -> (C3 B6)  = A-tilde + paragraph sign
//   * c-cedilla       -> (C3 A7)  = A-tilde + section sign
// None of the letters (A-tilde, A-diaeresis, A-ring) appear in legitimate
// Turkish content, so flagging any of them followed by a non-ASCII char is
// a reliable mojibake signal.
const MOJIBAKE_PATTERN = /[\u00C3\u00C4\u00C5][\u0080-\u024F]/g;

// Known-safe sequences that contain the pattern characters but are legitimate.
// (None currently — Turkish content should never produce Ã/Ä/Å + continuation.)
const KNOWN_SAFE_EXCEPTIONS = new Set();

// Files and directories to scan.
const SCAN_TARGETS = [
  "index.html",
  "src/App.tsx",
  "src/pages",
  "src/components",
  "src/content",
  "src/lib",
  "src/hooks",
  "src/types",
];

const EXTENSIONS = new Set([".html", ".tsx", ".ts", ".md", ".json", ".yml", ".yaml"]);

// Directories to skip entirely.
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "build", "coverage"]);

/**
 * Recursively walk a directory and yield file paths with matching extensions.
 */
async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") {
      return;
    }
    throw err;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(full);
    } else if (entry.isFile()) {
      const dot = entry.name.lastIndexOf(".");
      if (dot === -1) continue;
      const ext = entry.name.slice(dot);
      if (EXTENSIONS.has(ext)) {
        yield full;
      }
    }
  }
}

/**
 * Scan a file for mojibake patterns. Returns an array of findings
 * in the shape { line, column, match, context }.
 */
function scanFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const findings = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    MOJIBAKE_PATTERN.lastIndex = 0;
    let match;
    while ((match = MOJIBAKE_PATTERN.exec(line)) !== null) {
      if (KNOWN_SAFE_EXCEPTIONS.has(match[0])) continue;
      // Context window: 15 chars before and after the match.
      const start = Math.max(0, match.index - 15);
      const end = Math.min(line.length, match.index + match[0].length + 15);
      findings.push({
        line: lineIdx + 1,
        column: match.index + 1,
        match: match[0],
        context: line.slice(start, end).trim(),
      });
    }
  }

  return findings;
}

async function main() {
  const allFindings = [];
  const filesScanned = [];

  for (const target of SCAN_TARGETS) {
    const fullTarget = join(projectRoot, target);
    let stat;
    try {
      stat = statSync(fullTarget);
    } catch (err) {
      if (err.code === "ENOENT") continue;
      throw err;
    }

    if (stat.isFile()) {
      filesScanned.push(fullTarget);
    } else if (stat.isDirectory()) {
      for await (const file of walk(fullTarget)) {
        filesScanned.push(file);
      }
    }
  }

  for (const file of filesScanned) {
    const findings = scanFile(file);
    if (findings.length > 0) {
      allFindings.push({ file, findings });
    }
  }

  const scannedCount = filesScanned.length;

  if (allFindings.length === 0) {
    console.log(`[check-encoding] OK — ${scannedCount} dosya tarandı, mojibake yok.`);
    process.exit(0);
  }

  console.error("");
  console.error("==============================================================");
  console.error("  HATA: UTF-8 encoding regresyonu tespit edildi");
  console.error("==============================================================");
  console.error("");
  console.error(
    "Türkçe karakterlerin CP1252 üzerinden çift kodlanmış (mojibake) hali bulundu.",
  );
  console.error("Bu, UTF-8 dosyanın yanlış encoding ile yeniden kaydedilmesinden kaynaklanır.");
  console.error("");
  console.error("Düzeltme:");
  console.error("  1. Dosyayı editörünüzde açın");
  console.error('  2. "Reopen with Encoding → UTF-8" veya eşdeğeri komutu çalıştırın');
  console.error("  3. Mojibake karakterleri doğru Türkçe harflerle manuel değiştirin");
  console.error("  4. Dosyayı UTF-8 olarak kaydedin");
  console.error("");
  console.error("Tespit edilen sorunlar:");
  console.error("");

  let totalMatches = 0;
  for (const { file, findings } of allFindings) {
    const rel = relative(projectRoot, file).split(sep).join("/");
    console.error(`  ${rel}`);
    for (const finding of findings) {
      totalMatches++;
      console.error(
        `    satır ${finding.line}:${finding.column}  "${finding.match}"  (${finding.context})`,
      );
    }
    console.error("");
  }

  console.error(
    `Toplam: ${allFindings.length} dosyada ${totalMatches} mojibake örneği (${scannedCount} dosya tarandı).`,
  );
  console.error("");
  process.exit(1);
}

main().catch((err) => {
  console.error("[check-encoding] Script hatası:", err);
  process.exit(2);
});
