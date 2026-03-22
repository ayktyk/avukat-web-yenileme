import { existsSync } from "fs";
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptPath = join(__dirname, "optimize-images.py");
const rootDir = join(__dirname, "..");

if (process.platform === "win32") {
  const powershell = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
  if (!existsSync(powershell)) {
    console.warn("Image optimizer skipped: PowerShell was not found.");
    process.exit(0);
  }

  const escapedScriptPath = scriptPath.replace(/'/g, "''");
  const command = [
    "$python = (Get-Command python -ErrorAction SilentlyContinue).Source",
    "if (-not $python) { Write-Host 'Image optimizer skipped: no Python runtime found.'; exit 0 }",
    `& $python '${escapedScriptPath}'`,
  ].join("; ");

  const result = spawnSync(
    powershell,
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command],
    {
      cwd: rootDir,
      encoding: "utf-8",
      stdio: "inherit",
    },
  );

  if (typeof result.status === "number") {
    process.exit(result.status);
  }

  console.warn("Image optimizer skipped: PowerShell process did not return a status.");
  process.exit(0);
}

const candidates = ["python3", "python"];

for (const command of candidates) {
  const probe = spawnSync(command, ["--version"], {
    cwd: rootDir,
    encoding: "utf-8",
    stdio: "pipe",
  });

  if (probe.status === 0) {
    const result = spawnSync(command, [scriptPath], {
      cwd: rootDir,
      encoding: "utf-8",
      stdio: "inherit",
    });

    if (typeof result.status === "number") {
      process.exit(result.status);
    }

    console.warn("Image optimizer skipped: Python process did not return a status.");
    process.exit(0);
  }
}

console.warn("Image optimizer skipped: no Python runtime found.");
process.exit(0);
