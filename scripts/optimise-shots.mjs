// Turns raw 1440×900 site captures into web-ready WebP at two widths (card + retina/desktop).
// Usage: node scripts/optimise-shots.mjs <folder-with-pngs>
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const src = process.argv[2];
const out = path.resolve('public/work');
const pick = { flyfoil: 'flyfoil-2.png', fintrack: 'fintrack.png', altura: 'altura.png', 'la-kafeteria': 'la-kafeteria.png', albania: 'albania-2.png' };
const files = new Set(await readdir(src));

for (const [id, file] of Object.entries(pick)) {
  if (!files.has(file)) throw new Error(`missing ${file}`);
  for (const width of [720, 1280]) {
    const info = await sharp(path.join(src, file))
      .resize({ width })
      .webp({ quality: 78, effort: 6 })
      .toFile(path.join(out, `${id}-${width}.webp`));
    console.log(`${id}-${width}.webp ${Math.round(info.size / 1024)} KB`);
  }
}
