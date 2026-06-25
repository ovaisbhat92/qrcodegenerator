/**
 * Generates favicon assets from an inline SVG.
 * Run once: node scripts/generate-favicons.mjs
 */
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const APP = join(ROOT, "app");

mkdirSync(PUBLIC, { recursive: true });

// ── SVG source ────────────────────────────────────────────────────────────────
// Vivid cyan-to-teal gradient background, white QR elements — high visibility
// at all sizes including 16×16 browser tabs.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="32" height="32" rx="6" fill="url(#bg)"/>

  <!-- Top-left finder square -->
  <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" fill="none" stroke="#ffffff" stroke-width="1.8"/>
  <rect x="6" y="6" width="2.5" height="2.5" rx="0.5" fill="#ffffff"/>

  <!-- Top-right finder square -->
  <rect x="21.5" y="3.5" width="7" height="7" rx="1.4" fill="none" stroke="#ffffff" stroke-width="1.8"/>
  <rect x="24" y="6" width="2.5" height="2.5" rx="0.5" fill="#ffffff"/>

  <!-- Bottom-left finder square -->
  <rect x="3.5" y="21.5" width="7" height="7" rx="1.4" fill="none" stroke="#ffffff" stroke-width="1.8"/>
  <rect x="6" y="24" width="2.5" height="2.5" rx="0.5" fill="#ffffff"/>

  <!-- Data dots (bottom-right) -->
  <rect x="21.5" y="21.5" width="2.5" height="2.5" rx="0.6" fill="#ffffff"/>
  <rect x="25.5" y="21.5" width="2.5" height="2.5" rx="0.6" fill="#ffffff"/>
  <rect x="21.5" y="25.5" width="2.5" height="2.5" rx="0.6" fill="#ffffff"/>
  <rect x="25.5" y="25.5" width="2.5" height="2.5" rx="0.6" fill="#ffffff"/>

  <!-- Centre timing dots -->
  <rect x="13" y="13" width="2.5" height="2.5" rx="0.5" fill="#ffffff"/>
  <rect x="16.5" y="13" width="2.5" height="2.5" rx="0.5" fill="#ffffff"/>
  <rect x="13" y="16.5" width="2.5" height="2.5" rx="0.5" fill="#ffffff"/>
  <rect x="16.5" y="16.5" width="2.5" height="2.5" rx="0.5" fill="#ffffff"/>
</svg>`;

const svgBuffer = Buffer.from(svg);

// ── PNG sizes ─────────────────────────────────────────────────────────────────

async function makePng(size, destPath) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(destPath);
  console.log(`✓ ${destPath}`);
}

// ── ICO builder (pure JS) ─────────────────────────────────────────────────────
// ICO format: header + directory + concatenated PNG blobs.
// Modern browsers accept PNG-compressed ICO frames.
async function makeIco(sizes, destPath) {
  const frames = await Promise.all(
    sizes.map((size) =>
      sharp(svgBuffer).resize(size, size).png().toBuffer()
    )
  );

  const numImages = frames.length;
  const HEADER = 6;              // 2+2+2
  const DIR_ENTRY = 16;          // 16 bytes per entry
  const dirOffset = HEADER + numImages * DIR_ENTRY;

  let dataOffset = dirOffset;
  const header = Buffer.alloc(HEADER);
  header.writeUInt16LE(0, 0);    // reserved
  header.writeUInt16LE(1, 2);    // type: 1 = ICO
  header.writeUInt16LE(numImages, 4);

  const dirs = frames.map((buf, i) => {
    const size = sizes[i];
    const dir = Buffer.alloc(DIR_ENTRY);
    dir.writeUInt8(size >= 256 ? 0 : size, 0);   // width  (0 means 256)
    dir.writeUInt8(size >= 256 ? 0 : size, 1);   // height
    dir.writeUInt8(0, 2);        // color count
    dir.writeUInt8(0, 3);        // reserved
    dir.writeUInt16LE(1, 4);     // colour planes
    dir.writeUInt16LE(32, 6);    // bits per pixel
    dir.writeUInt32LE(buf.length, 8);
    dir.writeUInt32LE(dataOffset, 12);
    dataOffset += buf.length;
    return dir;
  });

  writeFileSync(destPath, Buffer.concat([header, ...dirs, ...frames]));
  console.log(`✓ ${destPath}`);
}

// ── Run ───────────────────────────────────────────────────────────────────────

await makePng(32, join(PUBLIC, "favicon-32x32.png"));
await makePng(16, join(PUBLIC, "favicon-16x16.png"));
await makePng(180, join(APP, "apple-touch-icon.png"));
await makeIco([32, 16], join(APP, "favicon.ico"));

console.log("\nAll favicon assets generated.");
