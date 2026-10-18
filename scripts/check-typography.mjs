import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const tokens = JSON.parse(readFileSync('src/shared/theme/tokens.json', 'utf8'));
const expected = [
  'display',
  'heading-1',
  'heading-2',
  'heading-3',
  'heading-4',
  'body',
  'body-strong',
  'label',
  'caption',
  'badge',
];
for (const name of expected) {
  const role = tokens.typography[name];
  if (!role || !Number.isFinite(role.fontSize) || !Number.isFinite(role.lineHeight)) {
    throw new Error('Invalid shared typography role: ' + name);
  }
  if (role.lineHeight < role.fontSize) {
    throw new Error('Arabic line height would clip text: ' + name);
  }
}

const sources = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const name = join(dir, entry.name);
    return entry.isDirectory() ? sources(name) : name.endsWith('.tsx') ? [name] : [];
  });
const deprecatedSize = /\btext-(?:xs|sm|base|lg|xl|[2-9]xl)\b/;
const arbitrarySize = /\btext-\[(\d+(?:\.\d+)?)px\]/g;
const errors = [];
for (const filename of sources('src')) {
  const source = readFileSync(filename, 'utf8');
  for (const match of source.matchAll(/<AppText\b[\s\S]*?>/g)) {
    const openingTag = match[0];
    const largeArbitrary = [...openingTag.matchAll(arbitrarySize)].some(
      (value) => Number(value[1]) > 11,
    );
    if (deprecatedSize.test(openingTag) || largeArbitrary) {
      const line = source.slice(0, match.index).split('\n').length;
      errors.push(filename + ':' + line);
    }
  }
}
if (errors.length) {
  throw new Error(
    'AppText sizes must use semantic text-type-* classes, not local sizing: ' + errors.join(', '),
  );
}
process.stdout.write('Shared Arabic typography tokens and screen overrides validated.\n');
