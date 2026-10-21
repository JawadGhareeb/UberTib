import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (file) => readFileSync(file, 'utf8');
const config = read('src/shared/navigation/navigation-transitions.ts');
assert.ok(
  config.includes("('fade_from_bottom' as const)"),
  'Pages should use subtle directional-neutral native transitions',
);
assert.ok(config.includes("('fade' as const)"), 'Bottom tabs should crossfade');
assert.ok(config.includes("('none' as const)"), 'Respect system Reduce Motion');
assert.ok(
  config.includes('PAGE_TRANSITION_DURATION_MS = 260'),
  'Use consistent page duration on iOS',
);
assert.ok(config.includes('TAB_TRANSITION_DURATION_MS = 190'), 'Use quick tab duration');
assert.ok(
  config.includes("animationTypeForReplace: 'push' as const"),
  'Forward replace should not animate like a back pop',
);

for (const path of [
  'src/app/_layout.tsx',
  'src/app/booking/_layout.tsx',
  'src/app/assessment/_layout.tsx',
]) {
  const code = read(path);
  assert.ok(code.includes('useReducedMotion()'), path + ': reduced motion preference required');
  assert.ok(
    code.includes('...pageTransitionOptions(reduceMotion)'),
    path + ': missing shared Stack animation',
  );
  assert.ok(
    code.includes('backgroundColor: colors.surface.canvas'),
    path + ': dark/light canvas must remain consistent',
  );
  assert.ok(code.includes('headerShown: false'), path + ': retain custom header');
}

const tabs = read('src/app/(tabs)/_layout.tsx');
const screen = read('src/shared/components/ui/screen.tsx');
assert.ok(
  screen.includes('<View className={resolvedContentClassName}') &&
    !screen.includes('entering={FadeIn.'),
  'Shared Screen must not apply a second page-enter fade on top of Stack animations',
);
assert.ok(
  tabs.includes('...tabTransitionOptions(reduceMotion)'),
  'Tabs should animate scene changes',
);
assert.ok(tabs.includes('tabBarHideOnKeyboard: true'), 'Keyboard must still hide bottom bar');
assert.ok(tabs.includes('<PatientBottomBar'), 'Custom tab navigation preserved');
assert.ok(
  tabs.includes('navigation.navigate(route.name, route.params)'),
  'Tab navigation behavior preserved',
);

console.log(
  'Navigation animation contracts passed: root + nested stacks, custom tabs, RTL-neutral effects, reduced motion, theme and navigation preserved.',
);
