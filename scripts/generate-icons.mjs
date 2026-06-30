import sharp from 'sharp';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputPath = path.join(__dirname, '../public/logo.png'); // Use actual logo
const outputDir = path.join(__dirname, '../public/icons');

const inputBuffer = readFileSync(inputPath);

await Promise.all(
  sizes.map(async (size) => {
    const outPath = path.join(outputDir, `icon-${size}x${size}.png`);
    await sharp(inputBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 17, g: 17, b: 17, alpha: 1 } // #111111 dark bg
      })
      .png()
      .toFile(outPath);
    console.log(`✅ icon-${size}x${size}.png`);
  })
);

// Also copy as favicon
await sharp(inputBuffer)
  .resize(64, 64, { fit: 'contain', background: { r: 17, g: 17, b: 17, alpha: 1 } })
  .png()
  .toFile(path.join(__dirname, '../public/favicon.png'));

console.log('✅ favicon.png updated');
console.log('All icons generated from logo.png!');
