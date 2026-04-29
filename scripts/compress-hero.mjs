import sharp from "sharp";
import { readFileSync, writeFileSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const input = join(root, "public/hero-bg-1.webp");

const before = statSync(input).size;
const buffer = readFileSync(input);

const out = await sharp(buffer)
  .webp({ quality: 70, effort: 6, smartSubsample: true, nearLossless: false })
  .toBuffer();

writeFileSync(input, out);
const after = statSync(input).size;
console.log(`Hero: ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB (saved ${((before - after) / 1024).toFixed(1)} KB)`);
