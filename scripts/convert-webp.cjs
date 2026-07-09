const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '../public/images');
const sizeLimit = 50 * 1024; // 50KB

async function processDirectory(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Directory does not exist: ${directory}`);
    return;
  }
  
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.match(/\.(png|jpg|jpeg)$/i)) {
      if (stat.size > sizeLimit) {
        const ext = path.extname(file);
        const name = path.basename(file, ext);
        const outPath = path.join(directory, `${name}.webp`);
        
        console.log(`Converting ${file} (${(stat.size/1024).toFixed(2)} KB) -> ${name}.webp`);
        try {
          await sharp(fullPath).webp({ quality: 80 }).toFile(outPath);
          console.log(`Success: ${name}.webp`);
        } catch (err) {
          console.error(`Error converting ${file}:`, err);
        }
      } else {
        console.log(`Skipping ${file} (under 50KB: ${(stat.size/1024).toFixed(2)} KB)`);
      }
    }
  }
}

processDirectory(dir).then(() => console.log('Done converting images.'));
