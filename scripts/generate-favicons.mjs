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
// Navy (#0a1628) background, cyan (#06b6d4) stylised QR code.
// The icon uses three finder-pattern squares (top-left, top-right, bottom-left)
// and a 3×3 grid of data dots to read as a QR at tiny sizes.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Background -->
  <rect width="32" height="32" rx="6" fill="#0a1628"/>

  <!-- Top-left finder square (outer 7×7 at 3,3) -->
  <rect x="3" y="3" width="7" height="7" rx="1.2" fill="none" stroke="#06b6d4" stroke-width="1.5"/>
  <rect x="5.5" y="5.5" width="2" height="2" rx="0.4" fill="#06b6d4"/>

  <!-- Top-right finder square (outer 7×7 at 22,3) -->
  <rect x="22" y="3" width="7" height="7" rx="1.2" fill="none" stroke="#06b6d4" stroke-width="1.5"/>
  <rect x="24.5" y="5.5" width="2" height="2" rx="0.4" fill="#06b6d4"/>

  <!-- Bottom-left finder square (outer 7×7 at 3,22) -->
  <rect x="3" y="22" width="7" height="7" rx="1.2" fill="none" stroke="#06b6d4" stroke-width="1.5"/>
  <rect x="5.5" y="24.5" width="2" height="2" rx="0.4" fill="#06b6d4"/>

  <!-- Data dots (bottom-right quadrant, 3×3 grid) -->
  <rect x="22" y="22" width="2.2" height="2.2" rx="0.5" fill="#06b6d4"/>
  <rect x="25.4" y="22" width="2.2" height="2.2" rx="0.5" fill="#06b6d4"/>
  <rect x="22" y="25.4" width="2.2" height="2.2" rx="0.5" fill="#06b6d4"/>

  <!-- Timing dots (centre strip) -->
  <rect x="13" y="13" width="2" height="2" rx="0.4" fill="#06b6d4"/>
  <rect x="16.5" y="13" width="2" height="2" rx="0.4" fill="#06b6d4"/>
  <rect x="13" y="16.5" width="2" height="2" rx="0.4" fill="#06b6d4"/>
  <rect x="16.5" y="16.5" width="2" height="2" rx="0.4" fill="#06b6d4"/>
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
