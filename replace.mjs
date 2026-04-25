import fs from 'fs';
import path from 'path';

const map = {
  'bg-[#020508]': 'bg-[var(--bg)]',
  'bg-[#0a0f16]': 'bg-[var(--bg2)]',
  'bg-[#121822]': 'bg-[var(--bg3)]',
  'bg-[#05080c]': 'bg-[var(--bg2)]',
  'bg-gray-900': 'bg-[var(--bg3)]',
  'border-gray-800': 'border-[var(--border)]',
  'border-gray-700': 'border-[var(--border2)]',
  'text-gray-400': 'text-[var(--text2)]',
  'text-gray-500': 'text-[var(--text3)]',
  'text-gray-300': 'text-[var(--text2)]',
  'text-gray-600': 'text-[var(--text3)]',
  'text-gray-800': 'text-[var(--text3)]',
  'text-white': 'text-[var(--text)]',
  'text-[#020508]': 'text-[var(--bg)]',
  'border-[#020508]': 'border-[var(--bg)]',
  'from-white': 'from-[var(--text)]',
  'bg-white': 'bg-[var(--text)]'
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Global replacements based on map
      for (const [key, value] of Object.entries(map)) {
        // use a regex to match exact class names (not a substring of something else)
        // e.g. avoid replacing bg-white inside bg-white/20, wait we can just do simple replace since these are mostly standalone or followed by /opacity
        // Actually, text-[#020508] might be text-[#020508]/90
        const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        content = content.replace(regex, value);
      }
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(process.cwd(), 'app'));
processDir(path.join(process.cwd(), 'components'));
