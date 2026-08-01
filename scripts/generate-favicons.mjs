// Vega Hukuk marka amblemini (altin yildiz + terazi) favicon setine donusturur.
//
// Neden var: public/favicon.ico uzun sure Lovable sablonundan kalan kalp logosuydu ve
// Google arama sonuclarinda buronun yaninda o ikon cikiyordu. Google favicon'u ana
// sayfadaki <link rel="icon"> uzerinden alir; kare, 48px'ten buyuk ve taranabilir olmali.
//
// Kaynak gorselde amblemin altinda "VEGA" yazisi var; favicon boyutunda okunamadigi ve
// kirpildiginda kirli gorundugu icin yalnizca amblem alinip lacivert kare zemine ortalanir.
//
// Calistirma: node scripts/generate-favicons.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'sosyal_medya_profil.png');
const PUBLIC = path.join(ROOT, 'public');

// Kaynak gorselde olculen amblem sinirlari (altin piksel analizi ile bulundu).
const EMBLEM = { left: 370, top: 227, width: 512, height: 491 };
const BACKGROUND = { r: 15, g: 33, b: 64, alpha: 1 }; // #0f2140 — kaynaktaki lacivert
const CANVAS = 1024; // ana kare; tum boyutlar bundan turetilir
const PADDING_RATIO = 0.11; // amblemin cevresinde nefes payi

const buildIco = (entries) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  const directory = Buffer.alloc(16 * entries.length);
  let offset = header.length + directory.length;

  entries.forEach((entry, i) => {
    const base = i * 16;
    directory.writeUInt8(entry.size >= 256 ? 0 : entry.size, base + 0);
    directory.writeUInt8(entry.size >= 256 ? 0 : entry.size, base + 1);
    directory.writeUInt8(0, base + 2); // palette
    directory.writeUInt8(0, base + 3); // reserved
    directory.writeUInt16LE(1, base + 4); // color planes
    directory.writeUInt16LE(32, base + 6); // bits per pixel
    directory.writeUInt32LE(entry.data.length, base + 8);
    directory.writeUInt32LE(offset, base + 12);
    offset += entry.data.length;
  });

  return Buffer.concat([header, directory, ...entries.map((e) => e.data)]);
};

const run = async () => {
  if (!fs.existsSync(SOURCE)) {
    throw new Error(`Marka gorseli bulunamadi: ${SOURCE}`);
  }

  const inner = Math.round(CANVAS * (1 - PADDING_RATIO * 2));
  const emblem = await sharp(SOURCE)
    .extract(EMBLEM)
    .resize(inner, inner, { fit: 'contain', background: BACKGROUND })
    .toBuffer();

  const master = await sharp({
    create: { width: CANVAS, height: CANVAS, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: emblem, gravity: 'center' }])
    .png()
    .toBuffer();

  const png = (size) => sharp(master).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

  const outputs = [
    ['favicon-96x96.png', 96],
    ['favicon-192x192.png', 192],
    ['favicon-512x512.png', 512],
    ['apple-touch-icon.png', 180],
    ['logo.png', 512], // LegalService/Organization schema logosu (kare)
  ];

  for (const [name, size] of outputs) {
    fs.writeFileSync(path.join(PUBLIC, name), await png(size));
    console.log(`  ${name.padEnd(24)} ${size}x${size}`);
  }

  // ICO: Google ve eski tarayicilar icin. 16/32/48 yeterli, 48 Google'in onerdigi taban.
  const icoSizes = [16, 32, 48];
  const entries = [];
  for (const size of icoSizes) {
    entries.push({ size, data: await png(size) });
  }
  fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), buildIco(entries));
  console.log(`  favicon.ico              ${icoSizes.join(', ')} px`);
};

run().then(
  () => console.log('Favicon seti uretildi.'),
  (error) => {
    console.error('Favicon uretimi basarisiz:', error.message);
    process.exitCode = 1;
  },
);
