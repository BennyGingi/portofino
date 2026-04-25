import fs from 'fs';
import path from 'path';

const map = {
  'bg-gray-800': 'bg-[var(--border)]',
  'bg-gray-600': 'bg-[var(--border3)]',
  'text-gray-800': 'text-[var(--text3)]',
  'border-cyan/30': 'border-[var(--cyan)]/30',
  'bg-cyan/5': 'bg-[var(--cyan)]/5',
  'bg-cyan/10': 'bg-[var(--cyan)]/10',
  'border-cyan/20': 'border-[var(--cyan)]/20',
  'bg-orange/10': 'bg-[var(--orange)]/10',
  'border-orange/20': 'border-[var(--orange)]/20',
  'text-purple-400': 'text-[var(--orange)]',
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      for (const [key, value] of Object.entries(map)) {
        const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        content = content.replace(regex, value);
      }
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(process.cwd(), 'app'));
processDir(path.join(process.cwd(), 'components'));
