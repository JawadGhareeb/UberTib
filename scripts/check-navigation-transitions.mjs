import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (file) => readFileSync(file, 'utf8');
const config = read('src/shared/navigation/navigation-transitions.ts');

assert.ok(config.includes("('slide_from_right' as const)"), 'All stacks need horizontal slide');
assert.ok(
  config.includes('PAGE_PUSH_DURATION_MS = 390') && config.includes('PAGE_POP_DURATION_MS = 340'),
  'Use same controlled timings for opening/closing all stacks',
);
assert.ok(
  config.includes('Easing.bezier(') && config.includes('easing: slideEasing'),
  'Both stack and tab transitions must use non-linear easing',
);
assert.ok(
  config.includes('cardOverlayEnabled: false') && config.includes('cardShadowEnabled: false'),
  'Avoid extra composited layers during Android transitions',
);
assert.ok(
  config.includes("('shift' as const)") &&
    config.includes('outputRange: [-screenWidth, 0, screenWidth]') &&
    config.includes("extrapolate: 'clamp'"),
  'Bottom tabs need full-width bounded slide',
);
assert.ok(config.includes('TAB_TRANSITION_DURATION_MS = 360'), 'Tab slide should be smooth');
assert.ok(config.includes("('none' as const)"), 'Respect system Reduce Motion');
assert.ok(config.includes("animationTypeForReplace: 'push' as const"), 'Keep replace forward');

for (const path of [
  'src/app/_layout.tsx',
  'src/app/booking/_layout.tsx',
  'src/app/assessment/_layout.tsx',
]) {
  const code = read(path);
  assert.ok(code.includes("from 'expo-router/js-stack'"), path + ': timed JS Stack required');
  assert.ok(code.includes('useReducedMotion()'), path + ': reduced motion required');
  assert.ok(
    code.includes('...pageTransitionOptions(reduceMotion)'),
    path + ': shared transitions missing',
  );
  assert.ok(
    code.includes('cardStyle: { backgroundColor: colors.surface.canvas }'),
    path + ': respect shared theme canvas',
  );
  assert.ok(code.includes('headerShown: false'), path + ': preserve custom header');
}

const tabs = read('src/app/(tabs)/_layout.tsx');
const header = read('src/shared/components/navigation/app-header.tsx');
const logo = read('src/shared/components/brand/brand-logo.tsx');
const screen = read('src/shared/components/ui/screen.tsx');
const careShell = read('src/features/my-care/components/care-screen-shell.tsx');

assert.ok(
  tabs.includes('...slideOptions') &&
    tabs.includes('lazy: false') &&
    tabs.includes('freezeOnBlur: true'),
  'Prepare tab scenes and freeze inactive ones to reduce hitches',
);
assert.ok(
  tabs.includes('tabBarHideOnKeyboard: true') &&
    tabs.includes('<PatientBottomBar') &&
    tabs.includes('navigation.navigate(route.name, route.params)'),
  'Preserve tab routing and keyboard safety',
);
assert.ok(
  !header.includes('FadeIn') && !header.includes('<Animated.View'),
  'Header/logo should appear immediately, not fade in on every page',
);
assert.ok(
  logo.includes('black-logo-header.png') &&
    logo.includes('white-logo-header.png') &&
    (logo.match(/fadeDuration={0}/g) ?? []).length === 2 &&
    existsSync('src/shared/assets/black-logo-header.png') &&
    existsSync('src/shared/assets/white-logo-header.png'),
  'Keep both resized logo images mounted without Android image fade',
);
assert.ok(
  !careShell.includes('FadeInDown.delay(') &&
    !careShell.includes('<Animated.View') &&
    screen.includes('<View className={resolvedContentClassName}') &&
    !screen.includes('entering={FadeIn.'),
  'Avoid duplicate content-enter animations over slide',
);
// Screen-entry fades duplicate the router's slide. Interactive overlays and
// confirmation dialogs intentionally keep their own independent effects.
for (const path of [
  'src/shared/components/ui/empty-state.tsx',
  'src/features/discovery/components/discover-search-illustration.tsx',
  'src/shared/components/navigation/patient-tab-item.tsx',
]) {
  const code = read(path);
  assert.ok(
    !code.includes('FadeIn') && !code.includes('entering='),
    path + ': route-mounted content must not fade in on top of the slide',
  );
}
assert.ok(
  read('src/shared/components/ui/confirmation-dialog.tsx').includes('FadeInDown') &&
    read('src/features/discovery/components/provider-comparison-bar.tsx').includes('FadeInUp'),
  'Contextual overlays retain separate interactive animations',
);

console.log('Smooth navigation and logo rendering contract checks passed.');
