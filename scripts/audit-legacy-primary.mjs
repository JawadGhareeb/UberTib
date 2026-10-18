import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const legacySwatches = ['#0F766E', '#0B5F59', '#79DED5', '#E6F5F3', '#173C38', '#00C8B8'];
const legacy = new RegExp(legacySwatches.join('|'), 'gi');
const sourceExtensions = /\.(?:tsx?|jsx?|css|svg|json)$/i;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
    const path = join(dir, item.name);
    if (item.isDirectory()) return walk(path);
    return sourceExtensions.test(item.name) ? [path] : [];
  });
}

const matches = [];
for (const filename of [...walk('src'), 'global.css', 'tailwind.config.js']) {
  const lines = readFileSync(filename, 'utf8').split('\n');
  lines.forEach((line, index) => {
    const found = [...new Set(line.match(legacy) ?? [])];
    if (found.length) matches.push(`${filename}:${index + 1} — ${found.join(', ')}`);
  });
}

if (matches.length) {
  process.stderr.write(
    'Found obsolete brand greens. Replace brand usages with semantic current-primary roles; retain semantic status colors.\n' +
      matches.join('\n') +
      '\n',
  );
  process.exitCode = 1;
} else {
  process.stdout.write('No known obsolete Pen/legacy brand greens in app source.\n');
}
