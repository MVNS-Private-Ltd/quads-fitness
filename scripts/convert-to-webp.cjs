const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imagesDir = path.join(process.cwd(), 'public', 'images');
const jpgs = ['gym-bg-1.jpg', 'gym-bg-2.jpg', 'gym-bg-3.jpg', 'gym-bg-4.jpg'];

(async () => {
  for (const jpg of jpgs) {
    const input = path.join(imagesDir, jpg);
    const output = path.join(imagesDir, jpg.replace('.jpg', '.webp'));
    if (!fs.existsSync(input)) { console.log(`Skipping ${jpg} (not found)`); continue; }
    const info = await sharp(input)
      .webp({ quality: 82 })
      .toFile(output);
    const before = fs.statSync(input).size;
    console.log(`✓ ${jpg} → ${jpg.replace('.jpg','.webp')}  ${Math.round(before/1024)}KB → ${Math.round(info.size/1024)}KB  (saved ${Math.round((1-info.size/before)*100)}%)`);
  }
  console.log('Done!');
})();
