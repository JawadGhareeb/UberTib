import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const app = JSON.parse(read('app.json'));
assert.equal(app.expo.android.softwareKeyboardLayoutMode, 'resize', 'Android keyboard must resize the visible window');

const sharedScroll = read('src/shared/components/ui/keyboard-responsive-scroll-view.tsx');
assert.ok(
  sharedScroll.includes('return (') &&
    sharedScroll.includes('<ScrollView') &&
    !sharedScroll.includes('KeyboardAwareScrollView') &&
    !sharedScroll.includes('contentInset=') &&
    !sharedScroll.includes('paddingBottom: keyboard'),
  'A native ScrollView must own only the content extent, without a keyboard-sized spacer/inset',
);

const sharedScreen = read('src/shared/components/ui/screen.tsx');
assert.ok(
  sharedScreen.includes("enabled={keyboardAvoiding && Platform.OS === 'ios'}"),
  'Shared Screen enables only iOS avoidance while Android uses adjustResize',
);

const authScreens = [
  'src/features/auth/screens/phone-entry-screen.tsx',
  'src/features/auth/screens/code-verification-screen.tsx',
  'src/features/auth/screens/profile-setup-screen.tsx',
];
const otherScreens = [
  'src/features/profile/components/profile-screen-shell.tsx',
  'src/features/booking/screens/booking-review-screen.tsx',
  'src/features/booking/screens/cancel-booking-screen.tsx',
  'src/features/booking/screens/reschedule-booking-screen.tsx',
  'src/features/my-care/screens/claims-screen.tsx',
];
for (const path of [...authScreens, ...otherScreens]) {
  const source = read(path);
  assert.ok(source.includes('<KeyboardResponsiveScrollView'), path + ' must be scrollable above keyboard');
  assert.ok(source.includes('keyboardShouldPersistTaps="handled"'), path + ' should accept taps while keyboard shows');
  assert.ok(!source.includes('<KeyboardAwareScrollView') && !source.includes('bottomOffset='), path + ' must not add phantom keyboard scroll extent');
}
for (const path of authScreens) {
  const source = read(path);
  assert.ok(
    source.includes("<KeyboardAvoidingView") &&
      source.includes("enabled={Platform.OS === 'ios'}") &&
      !source.includes('<View className="min-h-10 flex-1"') &&
      !source.includes('<View className="min-h-8 flex-1"') &&
      source.includes('className="mt-auto min-h-'),
    path + ' must avoid nested keyboard handling and flex:1 ghost space',
  );
}
const assessment = read('src/features/assessment/components/assessment-scaffold.tsx');
assert.ok(
  assessment.includes('<ScrollView') &&
    assessment.includes('<KeyboardAvoidingView') &&
    assessment.includes("enabled={Platform.OS === 'ios'}") &&
    !assessment.includes('KeyboardAwareScrollView'),
  'Assessment must also use one avoidance strategy and naturally bounded native scrolling',
);
for (const path of otherScreens) {
  const source = read(path);
  assert.ok(!source.includes('keyboardAvoiding={false}'), path + ' should rely on the iOS shared Screen keyboard avoiding wrapper');
}
console.log('Cross-platform keyboard scroll bounds contracts passed: native scroll content, iOS avoidance, Android resize, no extra keyboard insets.');
