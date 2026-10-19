import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(path, 'utf8');
const palette = JSON.parse(read('src/shared/theme/tokens.json'));
const css = read('src/shared/theme/uniwind-theme.css');
const generator = read('scripts/generate-uniwind-theme.mjs');
const app = JSON.parse(read('app.json')).expo;
const providers = read('src/providers/app-providers.tsx');
const root = read('src/app/_layout.tsx');
const hook = read('src/shared/theme/use-app-theme.ts');
const storage = read('src/shared/theme/theme-preference.ts');
const appearance = read('src/features/profile/screens/profile-appearance-screen.tsx');

function allSource(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) =>
    item.isDirectory()
      ? allSource(join(dir, item.name))
      : /\.[jt]sx?$/.test(item.name)
        ? [join(dir, item.name)]
        : [],
  );
}
const kebab = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());

assert.equal(palette.brand.mark, '#00E0B8');
for (const [mode, tokens] of [
  ['light', palette.color],
  ['dark', palette.darkColor],
]) {
  assert.equal(tokens.action.primary, palette.brand.mark);
  assert.ok(
    tokens.surface.default !== tokens.surface.canvas,
    mode + ': card must differ from canvas',
  );
  for (const [name, color] of Object.entries(tokens.text)) {
    assert.ok(/^#[a-f0-9]{6}$/i.test(color), mode + ': text.' + name + ' invalid');
  }
}
for (const role of Object.keys(palette.color.text)) {
  const name = kebab(role);
  assert.ok(
    css.includes('--color-content-' + name + ': var(--text-' + name + ');'),
    'Missing Tailwind text-content-' + name + ' utility',
  );
}
assert.ok(css.includes('@variant dark') && css.includes('@variant light'));
assert.ok(generator.includes('--color-content-'));
assert.ok(
  !existsSync('src/shared/theme/theme-provider.tsx'),
  'Custom ThemeProvider must be removed',
);
assert.ok(!providers.includes('ThemeProvider'));
assert.ok(hook.includes('useUniwind()'));
assert.ok(storage.includes('Uniwind.setTheme(scheme)'));
assert.ok(storage.includes('Appearance.setColorScheme(scheme)'));
assert.ok(storage.includes('secureStorage.getThemeScheme()'));
assert.ok(storage.includes('secureStorage.setThemeScheme(scheme)'));
assert.ok(root.includes('!fontsLoaded || !themeReady'));
assert.equal(app.userInterfaceStyle, 'automatic');
assert.ok(appearance.includes('darkTheme.surface.canvas'));
assert.ok(appearance.includes('lightTheme.surface.canvas'));
for (const path of allSource('src')) {
  const src = read(path);
  assert.ok(!src.includes('@/shared/theme/theme-provider'), path + ': stale ThemeProvider import');
  assert.ok(!src.includes('[TRUNCATED: file is '), path + ': truncated source');
}
console.log(
  'Uniwind provider-free Light/Dark contract, semantic text classes, system theme and preference persistence validated.',
);
