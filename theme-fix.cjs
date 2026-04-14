const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      content = content.replace(/bg-white\b/g, 'bg-vy-surface');
      content = content.replace(/bg-slate-50\b/g, 'bg-vy-bg');
      content = content.replace(/bg-slate-100\b/g, 'bg-vy-surface-muted');
      content = content.replace(/bg-slate-200\b/g, 'bg-vy-surface-muted');

      content = content.replace(/text-slate-900\b/g, 'text-vy-text');
      content = content.replace(/text-slate-800\b/g, 'text-vy-text');

      content = content.replace(/text-slate-700\b/g, 'text-vy-muted');
      content = content.replace(/text-slate-600\b/g, 'text-vy-muted');
      content = content.replace(/text-slate-500\b/g, 'text-vy-muted');
      content = content.replace(/text-slate-400\b/g, 'text-vy-muted');

      content = content.replace(/border-slate-100\b/g, 'border-vy-border');
      content = content.replace(/border-slate-200\b/g, 'border-vy-border');
      content = content.replace(/border-slate-300\b/g, 'border-vy-border');

      if (original !== content) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Finished recursive theme processing');
