import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'src'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Change gym-bg-X.jpg to .webp
  if (content.includes('gym-bg-')) {
    content = content.replace(/gym-bg-(\d)\.jpg/g, 'gym-bg-$1.webp');
    changed = true;
  }

  // Add width, height, loading to all <img> tags that don't have them
  // Basic regex to find <img ... />
  const imgRegex = /<img([^>]+)>/g;
  content = content.replace(imgRegex, (match, attrs) => {
    let newAttrs = attrs;
    let modified = false;

    // Skip Hero which we manually did
    if (!newAttrs.includes('width=')) {
      newAttrs += ' width="800"'; modified = true;
    }
    if (!newAttrs.includes('height=')) {
      newAttrs += ' height="600"'; modified = true;
    }
    // Only add lazy if not in Hero and doesn't already have it
    if (!newAttrs.includes('loading=') && !file.includes('Hero.jsx')) {
      newAttrs += ' loading="lazy"'; modified = true;
    }

    if (modified) {
      changed = true;
      return `<img${newAttrs}>`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Optimized images in:', file);
  }
});
