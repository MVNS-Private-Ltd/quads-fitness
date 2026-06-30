import sharp from 'sharp';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputPath = path.join(__dirname, '../public/icons/source-icon.png');
const outputDir = path.join(__dirname, '../public/icons');

const inputBuffer = readFileSync(inputPath);

await Promise.all(
  sizes.map(async (size) => {
    const outPath = path.join(outputDir, `icon-${size}x${size}.png`);
    await sharp(inputBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`✅ Created icon-${size}x${size}.png`);
  })
);

console.log('All icons generated!');
