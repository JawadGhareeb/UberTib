import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const screen = read('src/shared/components/ui/screen.tsx');
const root = read('src/app/_layout.tsx');
const booking = read('src/app/booking/_layout.tsx');
const assessment = read('src/app/assessment/_layout.tsx');
const assessmentShell = read('src/features/assessment/components/assessment-scaffold.tsx');
const comparison = read('src/features/discovery/components/provider-comparison-grid.tsx');
const config = JSON.parse(read('app.json'));

assert.ok(
  screen.includes('<KeyboardAvoidingView') &&
    screen.includes("behavior={Platform.OS === 'ios' ? 'padding' : undefined}") &&
    screen.includes('enabled={keyboardAvoiding && Platform.OS') &&
    screen.includes('keyboardAvoiding = true'),
  'Shared Screen must keep a keyboard-resized viewport and visible bottom CTAs on iOS',
);
assert.ok(
  assessmentShell.includes('keyboardAvoiding={false}') &&
    assessmentShell.includes('<KeyboardAvoidingView'),
  'Assessment retains its own keyboard avoidance instead of doubling the iOS inset',
);
assert.equal(config.expo.android.softwareKeyboardLayoutMode, 'resize');
assert.equal(config.expo.plugins[1][1].dark.backgroundColor, '#0A0A0A');
for (const route of [root, booking, assessment]) {
  assert.ok(route.includes('colors.surface.canvas'), 'Navigator surface must be themed');
}
assert.ok(
  root.includes('backgroundColor: colors.surface.canvas'),
  'Root navigator background follows app theme',
);
assert.ok(
  !comparison.includes('synchronizeHorizontal') &&
    !comparison.includes('rowsScrollRef') &&
    (comparison.match(/^\s*horizontal\s*$/gm) ?? []).length === 1 &&
    comparison.includes('bounces={false}'),
  'Comparison grid has one horizontal owner and no feedback loop',
);
process.stdout.write(
  'Dark navigation surfaces, keyboard viewport and three-doctor scroll contracts passed.\n',
);
