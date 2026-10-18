import { readFileSync, writeFileSync } from 'node:fs';

const tokensPath = 'src/shared/theme/tokens.json';
const tokens = JSON.parse(readFileSync(tokensPath, 'utf8'));
const write = process.argv.includes('--write');
const check = process.argv.includes('--check');

const hexToRGB = (hex) => {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error('Invalid theme color: ' + hex);
  return [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
};
const blend = (from, to, fraction) =>
  '#' +
  hexToRGB(from)
    .map((v, i) =>
      Math.round(v * (1 - fraction) + hexToRGB(to)[i] * fraction)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
    .toUpperCase();

export function deriveBrandColors(themeTokens) {
  const { mark: primary, ink, charcoal, white } = themeTokens.brand;
  const light = structuredClone(themeTokens.color);
  const dark = structuredClone(themeTokens.darkColor);

  // Never alter the brand's approved primary swatch between themes or while pressed.
  for (const palette of [light, dark]) {
    palette.action.primary = primary;
    palette.action.primaryActive = primary;
    palette.text.onAction = white;
    palette.text.onDestructive = white;
  }

  // Neutrals lead the light UI. Derived tints are reserved for selection/feedback.
  light.surface.canvas = blend(white, ink, 0.025);
  light.surface.default = white;
  light.surface.subtle = blend(white, charcoal, 0.042);
  light.surface.inverse = ink;
  light.surface.scrim = ink;
  light.text.primary = ink;
  light.text.secondary = blend(ink, white, 0.31);
  light.text.placeholder = blend(ink, white, 0.43);
  light.text.link = primary;
  light.text.onInverse = white;
  light.border.subtle = blend(white, charcoal, 0.14);
  light.border.default = blend(white, charcoal, 0.23);
  light.border.strong = blend(white, ink, 0.5);
  light.border.emphasis = charcoal;
  light.action.subtle = blend(white, primary, 0.105);
  light.action.secondarySurface = white;
  light.action.secondaryBorder = primary;
  light.action.secondaryText = primary;
  light.state.selected = blend(white, primary, 0.105);
  light.state.selectedBorder = primary;
  light.state.readonly = blend(white, ink, 0.045);
  light.state.readonlyBorder = light.border.default;
  light.focus.ring = primary;
  light.focus.ringContrast = white;

  // Dark mode changes neutral surfaces and muted tints, not the primary color.
  dark.surface.canvas = blend(ink, '#000000', 0.43);
  dark.surface.default = ink;
  dark.surface.subtle = charcoal;
  dark.surface.inverse = white;
  dark.surface.scrim = '#000000';
  dark.text.primary = white;
  dark.text.secondary = blend(white, charcoal, 0.24);
  dark.text.placeholder = blend(white, charcoal, 0.42);
  dark.text.link = primary;
  dark.text.onInverse = ink;
  dark.border.subtle = blend(ink, charcoal, 0.69);
  dark.border.default = blend(charcoal, white, 0.12);
  dark.border.strong = blend(charcoal, white, 0.31);
  dark.border.emphasis = primary;
  dark.action.subtle = blend(charcoal, primary, 0.12);
  dark.action.secondarySurface = blend(ink, charcoal, 0.35);
  dark.action.secondaryBorder = primary;
  dark.action.secondaryText = primary;
  dark.state.selected = blend(charcoal, primary, 0.12);
  dark.state.selectedBorder = primary;
  dark.state.readonly = charcoal;
  dark.state.readonlyBorder = dark.border.default;
  dark.focus.ring = primary;
  dark.focus.ringContrast = ink;

  // Non-brand danger, warning and info have independent meanings.
  return { color: light, darkColor: dark };
}

const next = { ...tokens, ...deriveBrandColors(tokens) };
const expected = JSON.stringify(next, null, 2) + '\n';
if (write) {
  writeFileSync(tokensPath, expected);
  process.stdout.write('Regenerated light/dark semantic colors from one brand swatch.\n');
} else if (check) {
  if (readFileSync(tokensPath, 'utf8') !== expected) {
    throw new Error('Theme colors are out of sync. Run npm run theme:sync');
  }
  process.stdout.write('Semantic light/dark colors match the brand generator.\n');
} else {
  process.stdout.write('Use --write to generate or --check to validate the brand scale.\n');
}
